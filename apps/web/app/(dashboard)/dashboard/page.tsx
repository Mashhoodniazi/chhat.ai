import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import BotSearchGrid from "@/components/dashboard/BotSearchGrid";
import type { SerializedBot } from "@/components/dashboard/BotSearchGrid";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [bots, user] = await Promise.all([
    prisma.bot.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { documents: true, conversations: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    }),
  ]);

  const totalConversations = bots.reduce((sum, bot) => sum + bot._count.conversations, 0);
  const totalDocs = bots.reduce((sum, bot) => sum + bot._count.documents, 0);
  const activeBots = bots.filter((b) => b._count.documents > 0).length;
  const needsSetup = bots.length - activeBots;
  const firstName = user?.name?.split(" ")[0] ?? "";

  const serializedBots: SerializedBot[] = bots.map((bot) => ({
    id: bot.id,
    name: bot.name,
    instructions: bot.instructions,
    createdAt: bot.createdAt.toISOString(),
    _count: bot._count,
  }));

  const stats = [
    {
      label: "Total Bots",
      value: bots.length,
      sub: bots.length === 1 ? "1 bot created" : `${bots.length} bots created`,
      accent: "from-violet-500 to-violet-600",
      lightBg: "bg-violet-50",
      href: "/bots",
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      label: "Needs Setup",
      value: needsSetup,
      sub: needsSetup === 0 ? "All bots are ready" : "Add docs to activate",
      accent: needsSetup === 0 ? "from-emerald-500 to-teal-500" : "from-amber-400 to-orange-400",
      lightBg: needsSetup === 0 ? "bg-emerald-50" : "bg-amber-50",
      href: "/bots",
      icon: needsSetup === 0 ? (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
    },
    {
      label: "Documents",
      value: totalDocs,
      sub: "in knowledge bases",
      accent: "from-indigo-500 to-blue-500",
      lightBg: "bg-indigo-50",
      href: null,
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Conversations",
      value: totalConversations,
      sub: "total across all bots",
      accent: "from-pink-500 to-rose-500",
      lightBg: "bg-pink-50",
      href: null,
      icon: (
        <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <GreetingHeader firstName={firstName} />
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your AI chatbots and track performance
            </p>
          </div>
          <Link
            href="/bots/new"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-200 hover:shadow-violet-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Bot
          </Link>
        </div>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const card = (
              <div
                className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full ${
                  stat.href ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer" : ""
                }`}
              >
                <div className={`h-1 w-full bg-gradient-to-r ${stat.accent}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 ${stat.lightBg} rounded-xl flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    {stat.href && (
                      <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            );

            return stat.href ? (
              <Link key={stat.label} href={stat.href}>
                {card}
              </Link>
            ) : (
              <div key={stat.label}>{card}</div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/bots/new"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 hover:border-violet-300 hover:text-violet-700 text-slate-600 px-3 py-2 rounded-xl transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Bot
          </Link>
          <Link
            href="/bots"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 hover:border-violet-300 hover:text-violet-700 text-slate-600 px-3 py-2 rounded-xl transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            View All Bots
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 hover:border-violet-300 hover:text-violet-700 text-slate-600 px-3 py-2 rounded-xl transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>

        {/* Bots section */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Your Bots</h2>
            {bots.length > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">
                {bots.length} bot{bots.length !== 1 ? "s" : ""} · {activeBots} active
              </p>
            )}
          </div>
          {bots.length > 0 && (
            <Link
              href="/bots"
              className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {bots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
            <div className="w-16 h-16 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Create your first bot</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Upload your knowledge base, configure your bot&apos;s personality, and embed it on your website in minutes.
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
