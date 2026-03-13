import React from "react";

interface Tip {
  text: string;
}

interface TipBoxProps {
  title?: string;
  tips: Tip[];
  variant?: "info" | "warning";
}

export default function TipBox({ title = "Tips", tips, variant = "info" }: TipBoxProps) {
  const colors =
    variant === "warning"
      ? "bg-amber-50 border-amber-200"
      : "bg-violet-50 border-violet-100";

  const iconColor = variant === "warning" ? "text-amber-500" : "text-violet-400";
  const titleColor = variant === "warning" ? "text-amber-700" : "text-violet-700";
  const textColor = variant === "warning" ? "text-amber-900" : "text-violet-900";
  const bulletColor = variant === "warning" ? "bg-amber-400" : "bg-violet-400";

  return (
    <div className={`rounded-xl border px-4 py-3.5 ${colors}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <svg className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className={`text-xs font-semibold uppercase tracking-wider ${titleColor}`}>{title}</p>
      </div>
      <ul className="space-y-1.5">
        {tips.map((tip, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${textColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${bulletColor}`} />
            <span className="leading-relaxed">{tip.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
