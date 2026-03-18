import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params;
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("apiKey");

  if (!apiKey) {
    return NextResponse.json({ error: "Missing apiKey" }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: { id: botId, embedApiKey: apiKey },
    select: {
      user: { select: { plan: true } },
    },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const hideBranding = bot.user.plan === "BUSINESS";

  return NextResponse.json(
    { hideBranding },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
