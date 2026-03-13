import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ botId: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { botId } = await params;

    const bot = await prisma.bot.findFirst({
      where: { id: botId, userId: session.user.id },
      include: {
        documents: { orderBy: { createdAt: "desc" } },
        _count: { select: { conversations: true, chunks: true } },
      },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { botId } = await params;
    const { name, instructions, widgetColor, widgetPosition, widgetGreeting, widgetPlaceholder } = await request.json();

    const existing = await prisma.bot.findFirst({
      where: { id: botId, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const bot = await prisma.bot.update({
      where: { id: botId },
      data: {
        name: name?.trim() || existing.name,
        instructions: instructions !== undefined ? instructions?.trim() || null : existing.instructions,
        widgetColor: widgetColor !== undefined ? widgetColor || "#4f46e5" : existing.widgetColor,
        widgetPosition: widgetPosition !== undefined ? widgetPosition : existing.widgetPosition,
        widgetGreeting: widgetGreeting !== undefined ? widgetGreeting?.trim() || null : existing.widgetGreeting,
        widgetPlaceholder: widgetPlaceholder !== undefined ? widgetPlaceholder?.trim() || "Ask a question..." : existing.widgetPlaceholder,
      },
    });

    return NextResponse.json(bot);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { botId } = await params;

    const existing = await prisma.bot.findFirst({
      where: { id: botId, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    await prisma.bot.delete({ where: { id: botId } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
