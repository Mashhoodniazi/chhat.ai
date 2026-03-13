import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { storeFile } from "@/lib/storage";
import { extractTextFromPdf, processDocument } from "@/lib/embeddings";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const botId = formData.get("botId") as string | null;

    if (!file || !botId) {
      return NextResponse.json(
        { error: "File and botId are required" },
        { status: 400 }
      );
    }

    const bot = await prisma.bot.findFirst({
      where: { id: botId, userId: session.user.id },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const allowedTypes = ["application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".txt")) {
      return NextResponse.json(
        { error: "Only PDF and text files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileUrl = await storeFile(buffer, file.name, file.type || "application/octet-stream");

    const document = await prisma.document.create({
      data: {
        botId,
        fileName: file.name,
        fileUrl,
        status: "processing",
      },
    });

    processDocumentAsync(document.id, botId, file.name, file.type, buffer);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processDocumentAsync(
  documentId: string,
  botId: string,
  fileName: string,
  fileType: string,
  buffer: Buffer
) {
  try {
    let text = "";

    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      text = await extractTextFromPdf(buffer);
    } else {
      text = buffer.toString("utf-8");
    }

    if (!text.trim()) {
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "failed" },
      });
      return;
    }

    await processDocument(documentId, botId, text);

    await prisma.document.update({
      where: { id: documentId },
      data: { status: "ready" },
    });
  } catch (error) {
    console.error(`Processing failed for document ${documentId}:`, error);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "failed" },
    });
  }
}
