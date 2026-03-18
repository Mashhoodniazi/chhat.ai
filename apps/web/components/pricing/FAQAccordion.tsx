"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is the Free plan really free forever?",
    a: "Yes, absolutely. The Free plan has no time limit and no usage caps. You can build and run as many bots as you need, have unlimited conversations, and it will never expire.",
  },
  {
    q: "Can I upgrade or downgrade at any time?",
    a: "Yes. You can switch between Free and Business plans at any time. Upgrades take effect immediately, and downgrades apply at the end of your billing period.",
  },
  {
    q: "What does \"Powered by Chaat.ai\" mean?",
    a: "On the Free plan, a small \"Powered by Chaat.ai\" badge appears at the bottom of your embedded chat widget. The Business plan removes this completely so your bot looks 100% native to your brand.",
  },
  {
    q: "Do I need a credit card to sign up?",
    a: "No. You can create a free account and start building bots instantly — no credit card required, ever.",
  },
  {
    q: "What happens to my bots if I downgrade?",
    a: "All your bots, documents, and conversation history are preserved. Your widget will simply show the \"Powered by Chaat.ai\" badge again when you switch back to Free.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
            <svg
              className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openIndex === i && (
            <div className="px-6 pb-5 border-t border-slate-50">
              <p className="text-sm text-slate-500 leading-relaxed pt-4">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
