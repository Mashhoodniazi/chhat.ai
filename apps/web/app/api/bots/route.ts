import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bots = await prisma.bot.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { documents: true, conversations: true } },
      },
    });

    return NextResponse.json(bots);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, instructions } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Bot name is required" }, { status: 400 });
    }

    const bot = await prisma.bot.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        instructions: instructions?.trim() || null,
      },
    });

    return NextResponse.json(bot, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
