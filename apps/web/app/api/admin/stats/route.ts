import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    freeUsers,
    businessUsers,
    totalBots,
    totalDocuments,
    totalConversations,
    totalMessages,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "FREE" } }),
    prisma.user.count({ where: { plan: "BUSINESS" } }),
    prisma.bot.count(),
    prisma.document.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, plan: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    totalUsers,
    freeUsers,
    businessUsers,
    totalBots,
    totalDocuments,
    totalConversations,
    totalMessages,
    recentUsers,
  });
}
