"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Bot {
  id: string;
  name: string;
  widgetColor: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { documents: number; conversations: number };
}

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  createdAt: string;
  bots: Bot[];
}

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [totalConversations, setTotalConversations] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingBotId, setDeletingBotId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editPlan, setEditPlan] = useState("FREE");
  const [editRole, setEditRole] = useState("USER");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setTotalConversations(data.totalConversations);
        setTotalDocuments(data.totalDocuments);
        setEditName(data.user.name ?? "");
        setEditPlan(data.user.plan);
        setEditRole(data.user.role);
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  async function saveChanges() {
    setSaving(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName || null, plan: editPlan, role: editRole }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser((prev) => prev ? { ...prev, ...updated } : null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
    setSaving(false);
  }

  async function deleteUser() {
    if (!confirm(`Delete ${user?.email}? This will permanently remove all their bots, documents, and conversations.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin786/users");
    } else {
      const err = await res.json();
      alert(err.error ?? "Failed to delete user");
      setDeleting(false);
    }
  }

  async function deleteBot(botId: string, botName: string) {
    if (!confirm(`Delete bot "${botName}"? This will remove all its documents and conversations.`)) return;
    setDeletingBotId(botId);
    const res = await fetch(`/api/admin/bots/${botId}`, { method: "DELETE" });
    if (res.ok && user) {
      setUser({ ...user, bots: user.bots.filter((b) => b.id !== botId) });
    }
    setDeletingBotId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-500">User not found.</p>
        <Link href="/admin786/users" className="text-violet-600 hover:underline text-sm">← Back to users</Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin786/users"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Users
          </Link>
          <span className="text-slate-200">/</span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {user.name ?? user.email}
              </h1>
              {user.name && <p className="text-sm text-slate-400">{user.email}</p>}
            </div>
            <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ml-1 ${
              user.plan === "BUSINESS" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"
            }`}>
              {user.plan}
            </span>
            {user.role === "ADMIN" && (
              <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-600">
                ADMIN
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Edit + Stats */}
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Account Stats</h2>
            <div className="space-y-3">
              {[
                { label: "Bots", value: user.bots.length },
                { label: "Documents", value: totalDocuments },
                { label: "Conversations", value: totalConversations },
                {
                  label: "Joined",
                  value: new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  }),
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className="text-sm font-semibold text-slate-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit user */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="No name"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Plan</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="FREE">FREE</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                {saving ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Permanently delete this user along with all their bots, documents, and conversations.
            </p>
            <button
              onClick={deleteUser}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-60 text-red-600 text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              {deleting ? "Deleting…" : "Delete User"}
            </button>
          </div>
        </div>

        {/* Right: Bots */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                Bots <span className="text-slate-400 font-normal">({user.bots.length})</span>
              </h2>
            </div>
            {user.bots.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                This user has no bots yet
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {user.bots.map((bot) => (
                  <div key={bot.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: bot.widgetColor ?? "#4f46e5" }}
                    >
                      {bot.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{bot.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Created {new Date(bot.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {" · "}Last updated {new Date(bot.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-5 text-xs text-slate-400 flex-shrink-0">
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
                    <button
                      onClick={() => deleteBot(bot.id, bot.name)}
                      disabled={deletingBotId === bot.id}
                      className="opacity-0 group-hover:opacity-100 text-xs font-medium text-red-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {deletingBotId === bot.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
