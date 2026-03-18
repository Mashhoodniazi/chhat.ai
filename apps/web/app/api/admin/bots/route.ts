import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [bots, total] = await Promise.all([
    prisma.bot.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        widgetColor: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, name: true } },
        _count: { select: { documents: true, conversations: true } },
      },
    }),
    prisma.bot.count({ where }),
  ]);

  return NextResponse.json({ bots, total, page, pages: Math.ceil(total / limit) });
}
