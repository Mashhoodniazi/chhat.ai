import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import BotPageTabs from "@/components/dashboard/BotPageTabs";

type Props = { params: Promise<{ botId: string }> };

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

export default async function BotDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { botId } = await params;

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3001";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: session.user.id },
    include: {
      documents: { orderBy: { createdAt: "desc" } },
      _count: { select: { conversations: true, chunks: true } },
    },
  });

  if (!bot) notFound();

  const color = BOT_COLORS[bot.name.charCodeAt(0) % BOT_COLORS.length];

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${color.bg} ring-1 ${color.ring} rounded-2xl flex items-center justify-center text-2xl font-bold ${color.text} flex-shrink-0`}>
              {bot.name[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{bot.name}</h1>
                <Badge variant={bot.documents.length > 0 ? "success" : "warning"}>
                  {bot.documents.length > 0 ? "Active" : "No documents"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-5 mt-1.5">
                {[
                  {
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ),
                    label: `${bot.documents.length} document${bot.documents.length !== 1 ? "s" : ""}`,
                  },
                  {
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    ),
                    label: `${bot._count.chunks} chunks indexed`,
                  },
                  {
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    ),
                    label: `${bot._count.conversations} conversation${bot._count.conversations !== 1 ? "s" : ""}`,
                  },
                ].map((stat, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                    {stat.icon}
                    {stat.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-8">
        <BotPageTabs
          botId={bot.id}
          embedApiKey={bot.embedApiKey}
          baseUrl={baseUrl}
          botName={bot.name}
          documents={bot.documents}
          initialName={bot.name}
          initialInstructions={bot.instructions || ""}
          widgetColor={bot.widgetColor ?? undefined}
          widgetPosition={bot.widgetPosition ?? undefined}
          widgetGreeting={bot.widgetGreeting}
          widgetPlaceholder={bot.widgetPlaceholder ?? undefined}
        />
      </div>
    </div>
  );
}
