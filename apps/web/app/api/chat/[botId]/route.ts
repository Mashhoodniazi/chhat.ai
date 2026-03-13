import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import openai from "@/lib/openai";
import { searchSimilarChunks } from "@/lib/pgvector";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 20;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: corsHeaders() }
      );
    }

    const { botId } = await params;
    const { message, apiKey, conversationId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const bot = await prisma.bot.findFirst({
      where: { id: botId, embedApiKey: apiKey },
    });

    if (!bot) {
      return NextResponse.json(
        { error: "Invalid bot or API key" },
        { status: 401, headers: corsHeaders() }
      );
    }

    const relevantChunks = await searchSimilarChunks(botId, message, 5);
    const context = relevantChunks.map((c) => c.content).join("\n\n---\n\n");

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, botId },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { botId },
        include: { messages: true },
      });
    }

    const botPersonality = bot.instructions?.trim()
      ? bot.instructions.trim()
      : "Be friendly and conversational. Talk like a helpful teammate, not a support manual. Keep answers short unless detail is needed. Use simple language and contractions.";

    const systemPrompt = `
You are a friendly assistant for ${bot.name}.

VISITOR NAME:
- If this is the very first message in the conversation and you don't know the visitor's name yet, answer their question (or greet them) AND naturally ask for their name at the end. Keep it casual: "By the way, what's your name?" or "Oh, and what should I call you?"
- Once you know their name, use it naturally — not on every single message, just occasionally where it feels warm and human (e.g. when answering a key question, when wrapping up, or when they seem confused). Never overdo it.
- Never ask for their name again once you already know it.

PERSONALITY:
- Talk like a helpful, knowledgeable friend — not a corporate support bot
- Keep answers short and natural unless detail is genuinely needed
- Use contractions (it's, you're, don't, can't)
- Vary how you open responses — don't start every reply the same way
- Never use filler phrases like "Certainly!", "Of course!", "Great question!"
- Match the user's energy — casual question = casual short answer

FORMATTING:
- Simple questions = 1-2 sentences, no lists
- Only use numbered steps when walking through a multi-step process
- Never bold random words unnecessarily
- No walls of text

WHEN YOU DON'T KNOW:
- Never say "I'm sorry, I don't have information about that in my knowledge base" — that sounds robotic
- If a user asks about a specific feature or capability of ${bot.name} and it's NOT mentioned anywhere in the context, treat its absence as a "no" — the feature likely doesn't exist. Say so naturally: "Nope, that's not something ${bot.name} supports right now." or "Not at the moment, no."
- For completely off-topic questions (weather, sports, general knowledge): "Ha, that's a bit outside what I can help with! Got any questions about ${bot.name}?"
- Never say "reach out to the team" for simple yes/no feature questions — just answer no confidently

STRICT RULES:
- Only answer from the context provided below
- Never invent features or capabilities not mentioned in the context
- Absence of a feature in the context = the feature doesn't exist → answer no, naturally

ADDITIONAL INSTRUCTIONS FROM BOT OWNER:
${botPersonality}

Context:
${context || "No relevant context found."}
`.trim();

    const conversationMessages = conversation.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
        { role: "user", content: message },
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    const encoder = new TextEncoder();
    let fullResponse = "";
    const convId = conversation.id;

    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`)
        );

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            fullResponse += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        await prisma.message.create({
          data: {
            conversationId: convId,
            role: "assistant",
            content: fullResponse,
          },
        });

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        ...corsHeaders(),
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
