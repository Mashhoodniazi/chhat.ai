import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import BotSearchGrid from "@/components/dashboard/BotSearchGrid";
import type { SerializedBot } from "@/components/dashboard/BotSearchGrid";

export default async function BotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bots = await prisma.bot.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { documents: true, conversations: true } },
    },
  });

  const activeBots = bots.filter((b) => b._count.documents > 0).length;

  const serializedBots: SerializedBot[] = bots.map((bot) => ({
    id: bot.id,
    name: bot.name,
    instructions: bot.instructions,
    createdAt: bot.createdAt.toISOString(),
    _count: bot._count,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Bots</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {bots.length} bot{bots.length !== 1 ? "s" : ""} total · {activeBots} active
            </p>
          </div>
          <Link
            href="/bots/new"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Bot
          </Link>
        </div>
      </div>

      <div className="p-8">
        {bots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
            <div className="w-16 h-16 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">No bots yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Create your first chatbot to get started. It only takes a few minutes.
            </p>
            <Link
              href="/bots/new"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-violet-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Bot
            </Link>
          </div>
        ) : (
          <BotSearchGrid bots={serializedBots} />
        )}
      </div>
    </div>
  );
}
