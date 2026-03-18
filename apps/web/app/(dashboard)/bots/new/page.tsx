"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
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

function getBotColor(name: string) {
  return BOT_COLORS[name.charCodeAt(0) % BOT_COLORS.length];
}

const NEXT_STEPS = [
  {
    n: "1",
    title: "Upload documents",
    desc: "Add PDFs, text files or paste content to build your knowledge base.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    n: "2",
    title: "Test the chat",
    desc: "Ask questions live to see how your bot responds.",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    n: "3",
    title: "Embed on your site",
    desc: "Copy a single script tag and drop it into your website.",
    accent: "from-blue-500 to-cyan-400",
  },
];

export default function NewBotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, instructions }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create bot");
        return;
      }

      router.push(`/bots/${data.id}`);
    } finally {
      setLoading(false);
    }
  }

  const hasName = name.trim().length > 0;
  const hasInstructions = instructions.trim().length > 0;
  const color = hasName ? getBotColor(name) : BOT_COLORS[0];

  const checklist = [
    { label: "Name your bot", done: hasName },
    { label: "Add personality (optional)", done: hasInstructions },
    { label: "Upload documents", done: false, upcoming: true },
    { label: "Test the chat", done: false, upcoming: true },
  ];

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <Link
          href="/bots"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Bots
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Bot</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Give it a name and personality — documents come next.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Form (2/3) ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Card 1: Bot Identity */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ring-1 transition-all duration-200 ${
                    hasName
                      ? `${color.bg} ${color.text} ${color.ring}`
                      : "bg-slate-100 text-slate-300 ring-slate-200"
                  }`}>
                    {hasName ? name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Bot Identity</p>
                    <p className="text-xs text-slate-400">Visible only in your dashboard</p>
                  </div>
                </div>

                <Input
                  label="Bot Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Support Bot, FAQ Assistant, Docs Helper"
                  required
                  maxLength={60}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-slate-400">Choose a clear, descriptive name</p>
                  <p className={`text-xs tabular-nums ${name.length >= 50 ? "text-amber-500 font-medium" : "text-slate-300"}`}>
                    {name.length}/60
                  </p>
                </div>
              </div>

              {/* Card 2: Personality */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Personality & Instructions</p>
                    <p className="text-xs text-slate-400">
                      Optional — defines tone and behavior
                    </p>
                  </div>
                </div>

                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Be friendly and conversational. Keep answers concise unless more detail is asked for. Use simple language and avoid jargon."
                  rows={6}
                />
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Leave blank to use the default helpful assistant persona. You can update this any time from bot settings.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-4">
                <Button type="submit" loading={loading} size="lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Bot
                </Button>
                <Link
                  href="/bots"
                  className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* ── Right: Info Panel (1/3) ── */}
          <div className="space-y-5">

            {/* Live preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Live Preview</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ring-1 transition-all duration-200 ${
                    hasName
                      ? `${color.bg} ${color.text} ${color.ring}`
                      : "bg-slate-100 text-slate-300 ring-slate-200"
                  }`}>
                    {hasName ? name[0].toUpperCase() : "?"}
                  </div>
                  <Badge variant="warning">No docs</Badge>
                </div>
                <p className={`font-bold text-sm mb-1 transition-colors ${hasName ? "text-slate-900" : "text-slate-300"}`}>
                  {hasName ? name : "Bot name…"}
                </p>
                {hasInstructions ? (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{instructions}</p>
                ) : (
                  <p className="text-xs text-slate-300 italic">No instructions set</p>
                )}
                <div className="flex gap-3 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    0 docs
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    0 chats
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-3">
                This is how your bot appears on the dashboard
              </p>
            </div>

            {/* Setup checklist */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Setup Checklist</p>
              <div className="space-y-3">
                {checklist.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      step.done
                        ? "bg-violet-600"
                        : step.upcoming
                        ? "border-2 border-dashed border-slate-200"
                        : "border-2 border-slate-200"
                    }`}>
                      {step.done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${
                      step.done
                        ? "text-slate-900 font-medium"
                        : step.upcoming
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-4">What happens next</p>
              <div className="space-y-4">
                {NEXT_STEPS.map((step) => (
                  <div key={step.n} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${step.accent} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm`}>
                      {step.n}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-violet-900">{step.title}</p>
                      <p className="text-xs text-violet-700/70 leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
