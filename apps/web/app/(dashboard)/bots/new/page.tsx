"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

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

  const steps = [
    { label: "Name your bot", done: name.length > 0 },
    { label: "Set instructions (optional)", done: instructions.length > 0 },
    { label: "Upload knowledge base", done: false, upcoming: true },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Bot</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Set up your bot in minutes. You&apos;ll upload documents on the next step.
        </p>
      </div>

      <div className="p-8">
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Bot Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Support Bot, FAQ Assistant, Docs Helper"
                    required
                    hint="Only visible in your dashboard"
                  />

                  <Textarea
                    label="Personality & Instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder={"Be friendly and conversational. Keep answers concise unless more detail is asked for. Use simple language."}
                    rows={6}
                    hint="Optional — defines your bot's tone and style. Leave blank for the default friendly assistant."
                  />

                  {error && (
                    <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" loading={loading} size="lg">
                      Create Bot →
                    </Button>
                    <Link href="/dashboard">
                      <Button type="button" variant="secondary" size="lg">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar: setup progress */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Setup Checklist</p>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                      <span className={`text-sm ${step.done ? "text-slate-900 font-medium" : step.upcoming ? "text-slate-300" : "text-slate-500"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    After creating your bot, you&apos;ll be taken to a page where you can upload documents and test it live.
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-4 bg-violet-50 border border-violet-100 rounded-2xl p-5">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-3">💡 Quick Tip</p>
                <p className="text-sm text-violet-800 leading-relaxed">
                  Give your bot a clear, descriptive name. You can always rename it later from the bot settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
