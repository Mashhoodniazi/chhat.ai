import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const [
    totalUsers,
    freeUsers,
    businessUsers,
    totalBots,
    totalDocuments,
    totalConversations,
    totalMessages,
    recentUsers,
    topBots,
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
      take: 8,
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        role: true,
        createdAt: true,
        _count: { select: { bots: true } },
      },
    }),
    prisma.bot.findMany({
      orderBy: { conversations: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        name: true,
        widgetColor: true,
        user: { select: { email: true, name: true } },
        _count: { select: { conversations: true, documents: true } },
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      sub: `${businessUsers} Business · ${freeUsers} Free`,
      accent: "from-violet-500 to-violet-600",
      lightBg: "bg-violet-50",
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: "/admin786/users",
    },
    {
      label: "Total Bots",
      value: totalBots,
      sub: "across all users",
      accent: "from-blue-500 to-indigo-500",
      lightBg: "bg-blue-50",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      href: "/admin786/bots",
    },
    {
      label: "Documents",
      value: totalDocuments,
      sub: "in all knowledge bases",
      accent: "from-emerald-500 to-teal-500",
      lightBg: "bg-emerald-50",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: null,
    },
    {
      label: "Conversations",
      value: totalConversations,
      sub: `${totalMessages.toLocaleString()} messages total`,
      accent: "from-pink-500 to-rose-500",
      lightBg: "bg-pink-50",
      icon: (
        <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      href: null,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
            <p className="text-sm text-slate-500 mt-0.5">Platform-wide statistics and recent activity</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const card = (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full">
                <div className={`h-1 w-full bg-gradient-to-r ${stat.accent}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 ${stat.lightBg} rounded-xl flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    {stat.href && (
                      <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value.toLocaleString()}</p>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
                </div>
              </div>
            );
            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="hover:-translate-y-0.5 transition-transform duration-150">
                {card}
              </Link>
            ) : (
              <div key={stat.label}>{card}</div>
            );
          })}
        </div>

        {/* Plan distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Plan Distribution</h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all"
                style={{ width: totalUsers > 0 ? `${(businessUsers / totalUsers) * 100}%` : "0%" }}
              />
            </div>
            <span className="text-xs text-slate-500 w-24 text-right">
              {totalUsers > 0 ? Math.round((businessUsers / totalUsers) * 100) : 0}% Business
            </span>
          </div>
          <div className="flex gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
              <strong>{businessUsers}</strong> Business
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
              <strong>{freeUsers}</strong> Free
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent users */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Recent Users</h2>
              <Link href="/admin786/users" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin786/users/${user.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {user.name ?? user.email}
                    </p>
                    {user.name && (
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      user.plan === "BUSINESS"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {user.plan}
                    </span>
                    {user.role === "ADMIN" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600">
                        ADMIN
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{user._count.bots} bots</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top bots by conversations */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Most Active Bots</h2>
              <Link href="/admin786/bots" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {topBots.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-slate-400">No bots yet</div>
              ) : (
                topBots.map((bot, i) => (
                  <div key={bot.id} className="flex items-center gap-3 px-6 py-3.5">
                    <span className="w-5 text-xs font-bold text-slate-300">#{i + 1}</span>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: bot.widgetColor ?? "#4f46e5" }}
                    >
                      {bot.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{bot.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {bot.user.name ?? bot.user.email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-700">{bot._count.conversations}</p>
                      <p className="text-xs text-slate-400">chats</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
