import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

const BOT_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-200" },
  { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-200" },
  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200" },
  { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
  { bg: "bg-pink-100", text: "text-pink-700", ring: "ring-pink-200" },
  { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-200" },
  { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-200" },
  { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-200" },
];

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bots.map((bot) => {
              const color = BOT_COLORS[bot.name.charCodeAt(0) % BOT_COLORS.length];
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
                        <span className="text-slate-300">·</span>
                        <span>{new Date(bot.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Add new bot card */}
            <Link href="/bots/new">
              <div className="group bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[200px]">
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-violet-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500 group-hover:text-violet-700 transition-colors">Add new bot</p>
                <p className="text-xs text-slate-400 mt-1">Ready in minutes</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
