"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Bot {
  id: string;
  name: string;
  widgetColor: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string; name: string | null };
  _count: { documents: number; conversations: number };
}

export default function AdminBotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBots = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search });
    const res = await fetch(`/api/admin/bots?${params}`);
    if (res.ok) {
      const data = await res.json();
      setBots(data.bots);
      setTotal(data.total);
      setPages(data.pages);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  async function deleteBot(botId: string, botName: string) {
    if (!confirm(`Delete bot "${botName}"? This will remove all its documents and conversations.`)) return;
    setDeletingId(botId);
    const res = await fetch(`/api/admin/bots/${botId}`, { method: "DELETE" });
    if (res.ok) fetchBots();
    setDeletingId(null);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">All Bots</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total.toLocaleString()} bot{total !== 1 ? "s" : ""} across all users
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by bot name…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bots.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No bots found{search ? ` for "${search}"` : ""}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Bot</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Owner</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Docs</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Chats</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Created</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bots.map((bot) => (
                  <tr key={bot.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ backgroundColor: bot.widgetColor ?? "#4f46e5" }}
                        >
                          {bot.name[0].toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{bot.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin786/users/${bot.user.id}`}
                        className="text-sm text-violet-600 hover:text-violet-700 hover:underline"
                      >
                        {bot.user.name ?? bot.user.email}
                      </Link>
                      {bot.user.name && (
                        <p className="text-xs text-slate-400">{bot.user.email}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{bot._count.documents}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{bot._count.conversations}</td>
                    <td className="px-4 py-4 text-sm text-slate-400">
                      {new Date(bot.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => deleteBot(bot.id, bot.name)}
                        disabled={deletingId === bot.id}
                        className="opacity-0 group-hover:opacity-100 text-xs font-medium text-red-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        {deletingId === bot.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {page} of {pages} · {total.toLocaleString()} bots
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
