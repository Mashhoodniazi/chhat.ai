"use client";

import { useState } from "react";

interface SuggestedQuestionsProps {
  botId: string;
  botName: string;
  primaryColor: string;
  initialQuestions: string[];
  onSaved: (questions: string[]) => void;
}

const EXAMPLES = [
  "What is your pricing?",
  "How do I get started?",
  "What features do you offer?",
  "How can I contact support?",
  "What are your business hours?",
  "Do you offer a free trial?",
];

function hexToRgba(hex: string, alpha: number) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(79,70,229,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

export default function SuggestedQuestions({
  botId,
  botName,
  primaryColor,
  initialQuestions,
  onSaved,
}: SuggestedQuestionsProps) {
  const [questions, setQuestions] = useState<string[]>(
    initialQuestions.length ? initialQuestions : []
  );
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const filtered = questions.filter((q) => q.trim());

  function addQuestion() {
    if (questions.length < 6) setQuestions((prev) => [...prev, ""]);
  }

  function updateQuestion(i: number, value: string) {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? value : q)));
  }

  function removeQuestion(i: number) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addExample(example: string) {
    if (questions.length < 6 && !questions.includes(example)) {
      setQuestions((prev) => [...prev, example]);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgetSuggestedQuestions: filtered }),
      });
      if (!res.ok) throw new Error();
      setSaveStatus("saved");
      onSaved(filtered);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  }

  const shadowColor = hexToRgba(primaryColor, 0.35);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Editor */}
      <div className="space-y-5">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Quick Reply Questions</h4>
          <p className="text-xs text-slate-500 mt-1">
            Add up to 6 questions that appear as clickable buttons when visitors first open the chat.
            Clicking one sends it as a message automatically.
          </p>
        </div>

        {/* Question inputs */}
        <div className="space-y-2.5">
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-0.5">No questions yet</p>
              <p className="text-xs text-slate-400 mb-4">Add questions or pick from examples below</p>
              <button
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-violet-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add first question
              </button>
            </div>
          ) : (
            <>
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                    placeholder={EXAMPLES[i] ?? "Type a question…"}
                    className="flex-1 text-sm text-slate-800 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
                  />
                  <button
                    onClick={() => removeQuestion(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {questions.length < 6 && (
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 w-full py-2.5 px-3.5 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add question
                  <span className="ml-auto text-xs text-slate-300">{questions.length}/6</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Example suggestions */}
        {questions.length < 6 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Examples — click to add:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.filter((e) => !questions.includes(e)).slice(0, 4).map((example) => (
                <button
                  key={example}
                  onClick={() => addExample(example)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all"
                >
                  + {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save */}
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
                Save Questions
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
        <h4 className="text-sm font-semibold text-slate-700">Preview</h4>
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden border border-slate-200" style={{ minHeight: "420px" }}>
          {/* Faux page content */}
          <div className="absolute inset-0 p-5 pointer-events-none">
            <div className="h-2.5 bg-slate-300/60 rounded-full w-2/3 mb-3" />
            <div className="h-2 bg-slate-300/50 rounded-full w-full mb-2" />
            <div className="h-2 bg-slate-300/50 rounded-full w-5/6 mb-2" />
            <div className="h-2 bg-slate-300/40 rounded-full w-4/5 mb-5" />
            <div className="h-2 bg-slate-300/40 rounded-full w-3/4" />
          </div>

          {/* Chat window */}
          <div
            className="absolute bottom-16 right-4 w-[240px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "340px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3.5 py-3 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
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

            {/* Messages */}
            <div className="flex-1 p-3 bg-white overflow-hidden">
              {/* Greeting bubble */}
              <div className="flex gap-2 items-start mb-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill={primaryColor}>
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H4a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M5 21l1.5-4.5h11L19 21H5z" />
                  </svg>
                </div>
                <div className="bg-slate-100 text-slate-700 text-[10px] leading-relaxed rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[160px]">
                  Hey! I&apos;m {botName}. What can I help you with today?
                </div>
              </div>

              {/* Suggestion pills */}
              {filtered.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {filtered.map((q, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-medium px-2.5 py-1 rounded-full border cursor-pointer"
                      style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: hexToRgba(primaryColor, 0.06) }}
                    >
                      {q}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {["Example question", "Another question"].map((q, i) => (
                    <span key={i} className="text-[9px] font-medium px-2.5 py-1 rounded-full border border-slate-200 text-slate-400">
                      {q}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex-shrink-0 bg-white border-t border-slate-100">
              <div className="flex items-center gap-1.5 mt-2.5 border border-slate-200 rounded-xl px-2.5 py-2">
                <span className="text-[10px] text-slate-400 flex-1 truncate">Ask a question…</span>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-[9px] text-center text-slate-400 mt-1.5">Powered by Chaat.ai</div>
            </div>
          </div>

          {/* Toggle button */}
          <div
            className="absolute bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: primaryColor, boxShadow: `0 4px 16px ${shadowColor}` }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
        </div>

        <p className="text-xs text-slate-400 flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pills disappear after the visitor clicks one or starts typing. They only appear once per session.
        </p>
      </div>
    </div>
  );
}
