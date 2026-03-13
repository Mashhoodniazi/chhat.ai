import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { redirect } from "next/navigation";

const BOT_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-200", dot: "bg-violet-500" },
  { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500" },
  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500" },
  { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  { bg: "bg-pink-100", text: "text-pink-700", ring: "ring-pink-200", dot: "bg-pink-500" },
  { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-200", dot: "bg-indigo-500" },
  { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-200", dot: "bg-teal-500" },
  { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-200", dot: "bg-orange-500" },
];

function getBotColor(name: string) {
  return BOT_COLORS[name.charCodeAt(0) % BOT_COLORS.length];
}

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
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {firstName ? `Good to see you, ${firstName} 👋` : "Dashboard"}
            </h1>
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
          {[
            {
              label: "Total Bots",
              value: bots.length,
              sub: `${activeBots} active`,
              accent: "from-violet-500 to-violet-600",
              lightBg: "bg-violet-50",
              icon: (
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              ),
            },
            {
              label: "Active Bots",
              value: activeBots,
              sub: "with documents",
              accent: "from-emerald-500 to-teal-500",
              lightBg: "bg-emerald-50",
              icon: (
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              label: "Documents",
              value: totalDocs,
              sub: "in knowledge bases",
              accent: "from-indigo-500 to-blue-500",
              lightBg: "bg-indigo-50",
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
              icon: (
                <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-1 w-full bg-gradient-to-r ${stat.accent}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 ${stat.lightBg} rounded-xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bots section */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Your Bots</h2>
            {bots.length > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">{bots.length} bot{bots.length !== 1 ? "s" : ""} total</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => {
              const color = getBotColor(bot.name);
              return (
                <Link key={bot.id} href={`/bots/${bot.id}`}>
                  <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${color.bg} ring-1 ${color.ring} rounded-2xl flex items-center justify-center text-lg font-bold ${color.text} flex-shrink-0`}>
                        {bot.name[0].toUpperCase()}
                      </div>
                      <Badge variant={bot._count.documents > 0 ? "success" : "warning"}>
                        {bot._count.documents > 0 ? "Active" : "No docs"}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1.5">{bot.name}</h3>
                      {bot.instructions ? (
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {bot.instructions}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-300 italic">No instructions set</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {bot._count.documents} docs
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          {bot._count.conversations} chats
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* New bot card */}
            <Link href="/bots/new">
              <div className="group bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[180px]">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-violet-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500 group-hover:text-violet-700 transition-colors">Add new bot</p>
                <p className="text-xs text-slate-400 mt-1">Set up in minutes</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
