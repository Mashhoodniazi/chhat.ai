"use client";

import { useState } from "react";

interface EmbedCodeProps {
  botId: string;
  embedApiKey: string;
  baseUrl: string;
  botName: string;
  savedColor?: string;
  savedPosition?: string;
  savedGreeting?: string | null;
  savedPlaceholder?: string;
}

const PRESET_COLORS = [
  { label: "Indigo", value: "#4f46e5" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Blue", value: "#2563eb" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Emerald", value: "#059669" },
  { label: "Rose", value: "#e11d48" },
  { label: "Orange", value: "#ea580c" },
  { label: "Slate", value: "#334155" },
];

function hexToRgba(hex: string, alpha: number) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(79,70,229,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

export default function EmbedCode({
  botId,
  embedApiKey,
  baseUrl,
  botName,
  savedColor,
  savedPosition,
  savedGreeting,
  savedPlaceholder,
}: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(savedColor ?? "#4f46e5");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">(
    (savedPosition as "bottom-right" | "bottom-left") ?? "bottom-right"
  );
  const [greetingMessage, setGreetingMessage] = useState(
    savedGreeting ?? `Hey! I'm ${botName}. What can I help you with today?`
  );
  const [placeholder, setPlaceholder] = useState(savedPlaceholder ?? "Ask a question...");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [snippetFormat, setSnippetFormat] = useState<"html" | "react" | "nextjs">("html");

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetColor: primaryColor,
          widgetPosition: position,
          widgetGreeting: greetingMessage,
          widgetPlaceholder: placeholder,
        }),
      });
      if (!res.ok) throw new Error();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  }

  function escapeJS(str: string) {
    return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "");
  }

  // </script> is split to prevent SSR HTML parser from prematurely closing the hydration script tag
  const scriptClose = "<" + "/script>";
  const htmlSnippet = [
    "<script>",
    "  window.ChatbotConfig = {",
    `    botId: "${botId}",`,
    `    apiKey: "${embedApiKey}",`,
    `    botName: "${escapeJS(botName)}",`,
    `    primaryColor: "${escapeJS(primaryColor)}",`,
    `    position: "${position}",`,
    `    greetingMessage: "${escapeJS(greetingMessage)}",`,
    `    placeholder: "${escapeJS(placeholder)}"`,
    "  };",
    scriptClose,
    `<script src="${baseUrl}/embed.js" async>${scriptClose}`,
  ].join("\n");

  const nextjsSnippet = [
    `import Script from 'next/script';`,
    ``,
    `// Add inside your layout.tsx or page.tsx <body>:`,
    `<Script id="chatbot-config" strategy="beforeInteractive">`,
    "  {`",
    "    window.ChatbotConfig = {",
    `      botId: "${botId}",`,
    `      apiKey: "${embedApiKey}",`,
    `      botName: "${escapeJS(botName)}",`,
    `      primaryColor: "${escapeJS(primaryColor)}",`,
    `      position: "${position}",`,
    `      greetingMessage: "${escapeJS(greetingMessage)}",`,
    `      placeholder: "${escapeJS(placeholder)}"`,
    "    };",
    "  `}",
    `</Script>`,
    `<Script src="${baseUrl}/embed.js" strategy="afterInteractive" />`,
  ].join("\n");

  const reactSnippet = [
    `// React (CRA / Vite) — add to App.jsx or App.tsx`,
    `// Vue 3 — use onMounted() instead of useEffect`,
    `// Angular — use ngOnInit() inside AppComponent`,
    ``,
    `import { useEffect } from 'react';`,
    ``,
    `useEffect(() => {`,
    `  window.ChatbotConfig = {`,
    `    botId: "${botId}",`,
    `    apiKey: "${embedApiKey}",`,
    `    botName: "${escapeJS(botName)}",`,
    `    primaryColor: "${escapeJS(primaryColor)}",`,
    `    position: "${position}",`,
    `    greetingMessage: "${escapeJS(greetingMessage)}",`,
    `    placeholder: "${escapeJS(placeholder)}"`,
    `  };`,
    `  const script = document.createElement('script');`,
    `  script.src = '${baseUrl}/embed.js';`,
    `  script.async = true;`,
    `  document.body.appendChild(script);`,
    `  return () => {`,
    `    document.getElementById('cb-widget-root')?.remove();`,
    `  };`,
    `}, []);`,
  ].join("\n");

  const activeSnippet =
    snippetFormat === "html" ? htmlSnippet :
    snippetFormat === "react" ? reactSnippet :
    nextjsSnippet;

  async function handleCopy() {
    await navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shadowColor = hexToRgba(primaryColor, 0.4);
  const isRight = position === "bottom-right";

  return (
    <div className="space-y-6">
      {/* Customization + Preview side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          <h4 className="text-sm font-semibold text-slate-700">Customize Widget</h4>

          {/* Color */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-slate-600">Primary Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => setPrimaryColor(c.value)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    primaryColor === c.value
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
              <div className="flex items-center gap-2 ml-1">
                <div className="relative w-7 h-7">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Custom color"
                  />
                  <div
                    className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center pointer-events-none"
                    title="Pick custom color"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{primaryColor}</span>
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-slate-600">Widget Position</label>
            <div className="flex gap-2.5">
              {(["bottom-right", "bottom-left"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                    position === p
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {p === "bottom-right" ? "↘  Bottom Right" : "↙  Bottom Left"}
                </button>
              ))}
            </div>
          </div>

          {/* Greeting Message */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-slate-600">Greeting Message</label>
            <textarea
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              rows={2}
              className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
          </div>

          {/* Placeholder */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-slate-600">Input Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-all shadow-sm shadow-violet-200"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
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
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Failed to save
              </span>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">Live Preview</h4>
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-100 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {previewOpen ? "Show closed" : "Show open"}
            </button>
          </div>

          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden border border-slate-200" style={{ height: "380px" }}>
            {/* Faux page content */}
            <div className="absolute inset-0 p-5">
              <div className="h-2.5 bg-slate-300/60 rounded-full w-2/3 mb-3" />
              <div className="h-2 bg-slate-300/50 rounded-full w-full mb-2" />
              <div className="h-2 bg-slate-300/50 rounded-full w-5/6 mb-2" />
              <div className="h-2 bg-slate-300/50 rounded-full w-4/5 mb-5" />
              <div className="h-2 bg-slate-300/40 rounded-full w-full mb-2" />
              <div className="h-2 bg-slate-300/40 rounded-full w-3/4" />
            </div>

            {/* Chat Window */}
            {previewOpen && (
              <div
                className={`absolute bottom-[68px] ${isRight ? "right-4" : "left-4"} w-[230px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
                style={{ height: "270px" }}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H4a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M5 21l1.5-4.5h11L19 21H5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{botName}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                      <span className="text-[10px] text-white/70">Online</span>
                    </div>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2 bg-white">
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill={primaryColor}>
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H4a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M5 21l1.5-4.5h11L19 21H5z" />
                      </svg>
                    </div>
                    <div className="bg-slate-100 text-slate-700 text-[10px] leading-relaxed rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[160px]">
                      {greetingMessage || `Hey! I'm ${botName}.`}
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="px-3 pb-3 flex-shrink-0 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-1.5 mt-2.5 border border-slate-200 rounded-xl px-2.5 py-2">
                    <span className="text-[10px] text-slate-400 flex-1 truncate">{placeholder || "Ask a question..."}</span>
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="white">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-[9px] text-center text-slate-400 mt-1.5">Powered by ChatBot AI</div>
                </div>
              </div>
            )}

            {/* Toggle Button */}
            <button
              className={`absolute bottom-4 ${isRight ? "right-4" : "left-4"} w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105`}
              style={{ backgroundColor: primaryColor, boxShadow: `0 4px 16px ${shadowColor}` }}
              onClick={() => setPreviewOpen((v) => !v)}
            >
              {previewOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Embed Snippet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h4 className="text-sm font-semibold text-slate-700">Embed Code</h4>
          {/* Framework tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-wrap">
            {([
              {
                id: "html",
                label: "HTML",
                icon: (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                id: "react",
                label: "React / Vue / Angular",
                icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.468a23.357 23.357 0 0 0-1.364-3.578l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.139s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.64-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.345l-.133-.467C4.456 4.992 4.7 2.942 5.945 2.221c1.246-.72 3.093.045 5.092 2.133l.34.366-.366.339a23.47 23.47 0 0 0-2.6 3.146l-.12.214-.247.04a23.468 23.468 0 0 0-3.735.826zm1.42-.982a24.76 24.76 0 0 1 3.14-.7 24.758 24.758 0 0 1 2.248-2.72c-1.553-1.57-3.051-2.196-3.866-1.73-.817.47-1.02 2.01-.522 4.15zM14.816 22.027c-.6 0-1.29-.19-2.048-.575l-.358-.192V21c0-3.363-.056-3.863-.056-4.031l.014-.192.158-.104c1.2-.795 2.441-1.692 3.25-2.856l.129-.192.247-.04c1.273-.213 2.559-.49 3.736-.826l.132.467c.724 2.886.48 4.936-.765 5.657-.502.29-1.045.434-1.623.434zm-1.178-1.084c1.553 1.57 3.051 2.196 3.866 1.73.817-.47 1.02-2.01.522-4.15a24.759 24.759 0 0 1-3.14.7 24.759 24.759 0 0 1-2.248 2.72zm-2.444.553c1.998 2.088 3.845 2.853 5.09 2.133 1.246-.721 1.49-2.771.765-5.657l-.133-.467c-1.176.336-2.462.613-3.736.826l-.12.214a23.358 23.358 0 0 1-2.599 3.146l-.367.338.1-.533z"/>
                  </svg>
                ),
              },
              {
                id: "nextjs",
                label: "Next.js",
                icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
                  </svg>
                ),
              },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setSnippetFormat(tab.id); setCopied(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  snippetFormat === tab.id
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <pre className="bg-slate-900 text-slate-100 text-xs rounded-2xl p-5 overflow-x-auto leading-relaxed font-mono">
            <code>{activeSnippet}</code>
          </pre>
          <button
            onClick={handleCopy}
            className={`
              absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all
              ${copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-700/80 hover:bg-slate-600 text-slate-300 border border-slate-600/50"
              }
            `}
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
                Copy
              </>
            )}
          </button>
        </div>

        {snippetFormat === "html" && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Paste before the{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">&lt;/body&gt;</code>{" "}
              tag. Works with:
            </p>
            <div className="flex flex-wrap gap-1.5 pl-5">
              {["Plain HTML", "WordPress", "Shopify", "Webflow", "Wix", "Squarespace", "PHP / Laravel", "Django / Flask", "Ruby on Rails"].map((p) => (
                <span key={p} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{p}</span>
              ))}
            </div>
          </div>
        )}
        {snippetFormat === "react" && (
          <p className="text-xs text-slate-400 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Add this to your root component (e.g.{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">App.jsx</code>).
              For <strong className="text-slate-500">Vue 3</strong> replace{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">useEffect</code>{" "}
              with{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">onMounted</code>.
              For <strong className="text-slate-500">Angular</strong> put it in{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">ngOnInit()</code>{" "}
              inside{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">AppComponent</code>.
            </span>
          </p>
        )}
        {snippetFormat === "nextjs" && (
          <p className="text-xs text-slate-400 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Add both{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">&lt;Script&gt;</code>{" "}
              tags inside the{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">&lt;body&gt;</code>{" "}
              of{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">layout.tsx</code>.
              Also works with <strong className="text-slate-500">Remix</strong> and <strong className="text-slate-500">Gatsby</strong> using their respective script helpers.
              Raw{" "}
              <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-xs">&lt;script&gt;</code>{" "}
              tags are not valid JSX.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
