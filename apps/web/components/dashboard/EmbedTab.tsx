"use client";

import { useState } from "react";

interface EmbedTabProps {
  botId: string;
  embedApiKey: string;
  baseUrl: string;
  botName: string;
  widgetColor?: string;
  widgetPosition?: string;
  widgetGreeting?: string | null;
  widgetPlaceholder?: string;
}

const PRESET_COLORS = [
  "#7c3aed",
  "#4f46e5",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#dc2626",
  "#ea580c",
  "#1e293b",
];

export default function EmbedTab({
  botId,
  embedApiKey,
  baseUrl,
  botName,
  widgetColor,
  widgetPosition,
  widgetGreeting,
  widgetPlaceholder,
}: EmbedTabProps) {
  const [color, setColor] = useState(widgetColor || "#7c3aed");
  const [position, setPosition] = useState(widgetPosition || "bottom-right");
  const [greeting, setGreeting] = useState(
    widgetGreeting || `Hey! I'm ${botName}. What can I help you with today?`
  );
  const [placeholder, setPlaceholder] = useState(
    widgetPlaceholder || "Ask a question..."
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showClosed, setShowClosed] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/bots/${botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetColor: color,
          widgetPosition: position,
          widgetGreeting: greeting,
          widgetPlaceholder: placeholder,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const snippet = `<script>
  window.ChatbotConfig = {
    botId: "${botId}",
    apiKey: "${embedApiKey}",
    botName: "${botName}"
  };
</script>
<script src="${baseUrl}/embed.js" async></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Customize + Preview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Embed on your website</h3>
            <p className="text-xs text-slate-500 mt-0.5">Customize your widget appearance then copy the code snippet.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* Left: Customization controls */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customize Widget</p>

            {/* Color */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2.5 block">Primary Color</label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-xl transition-all duration-150 ${
                      color === c
                        ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    title={c}
                  />
                ))}
                <div className="flex items-center gap-2 ml-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                    title="Custom color"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-24 text-xs border border-slate-200 rounded-lg px-2.5 py-2 font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2.5 block">Widget Position</label>
              <div className="flex gap-2">
                {[
                  { value: "bottom-right", label: "↘ Bottom Right" },
                  { value: "bottom-left", label: "↙ Bottom Left" },
                ].map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setPosition(pos.value)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                      position === pos.value
                        ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Greeting */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Greeting Message</label>
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                rows={3}
                className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none transition-all hover:border-slate-300"
                placeholder={`Hey! I'm ${botName}. What can I help you with today?`}
              />
            </div>

            {/* Placeholder */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Input Placeholder</label>
              <input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all hover:border-slate-300"
                placeholder="Ask a question..."
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Widget Settings
                </>
              )}
            </button>
          </div>

          {/* Right: Live preview */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</p>
              <button
                onClick={() => setShowClosed(!showClosed)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Show {showClosed ? "open" : "closed"}
              </button>
            </div>

            {/* Mock browser frame */}
            <div className="relative bg-slate-100 rounded-2xl overflow-hidden" style={{ minHeight: "360px" }}>
              {/* Fake browser address bar */}
              <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                </div>
                <div className="flex-1 bg-slate-100 rounded-md h-5 mx-2" />
              </div>

              {/* Fake page content */}
              <div className="absolute inset-0 top-9 p-5">
                <div className="space-y-2 opacity-40">
                  <div className="h-3 bg-slate-300 rounded w-3/5" />
                  <div className="h-3 bg-slate-300 rounded w-4/5" />
                  <div className="h-3 bg-slate-300 rounded w-2/5" />
                  <div className="h-10 bg-slate-200 rounded-lg mt-4 w-full" />
                  <div className="h-3 bg-slate-300 rounded w-3/4" />
                  <div className="h-3 bg-slate-300 rounded w-1/2" />
                </div>
              </div>

              {/* Widget (bottom-right or bottom-left) */}
              <div
                className={`absolute bottom-4 flex flex-col items-end gap-2 ${
                  position === "bottom-left" ? "left-4 items-start" : "right-4 items-end"
                }`}
              >
                {!showClosed && (
                  <div className="w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    {/* Chat header */}
                    <div
                      style={{ backgroundColor: color }}
                      className="px-3.5 py-3 flex items-center gap-2.5"
                    >
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold truncate">{botName}</p>
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-emerald-300 rounded-full" />
                          <span className="text-white/70 text-xs">Online</span>
                        </div>
                      </div>
                    </div>

                    {/* Greeting message */}
                    <div className="p-3 bg-slate-50/70">
                      <div className="flex gap-2 items-start">
                        <div
                          style={{ backgroundColor: color + "25" }}
                          className="w-5 h-5 rounded-lg flex-shrink-0 mt-0.5"
                        />
                        <div className="bg-white rounded-xl rounded-tl-sm px-2.5 py-2 text-xs text-slate-700 shadow-sm border border-slate-100 max-w-[85%]">
                          {greeting || `Hey! I'm ${botName}. How can I help?`}
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5">
                      <div className="flex-1 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 border border-slate-100 truncate">
                        {placeholder || "Ask a question..."}
                      </div>
                      <div
                        style={{ backgroundColor: color }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Launcher button */}
                <div
                  style={{ backgroundColor: color }}
                  className="w-11 h-11 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer"
                >
                  {showClosed ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Embed Code</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste this before the{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-xs">&lt;/body&gt;</code>{" "}
              tag on any page of your website.
            </p>
          </div>
        </div>
        <div className="relative">
          <pre className="bg-slate-900 text-slate-100 text-xs rounded-2xl p-5 overflow-x-auto leading-relaxed font-mono">
            <code>{snippet}</code>
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-700/80 hover:bg-slate-600 text-slate-300 border border-slate-600/50"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
