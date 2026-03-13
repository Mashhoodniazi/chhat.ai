"use client";

import { useState } from "react";
import EmbedTab from "@/components/dashboard/EmbedTab";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import BotTester from "@/components/dashboard/BotTester";
import BotSettings from "@/components/dashboard/BotSettings";
import TipBox from "@/components/ui/TipBox";
import type { Document } from "@prisma/client";

interface BotPageTabsProps {
  botId: string;
  embedApiKey: string;
  baseUrl: string;
  botName: string;
  documents: Document[];
  initialName: string;
  initialInstructions: string;
  widgetColor?: string;
  widgetPosition?: string;
  widgetGreeting?: string | null;
  widgetPlaceholder?: string;
}

const tabs = [
  {
    id: "embed",
    label: "Embed",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "knowledge",
    label: "Knowledge Base",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "test",
    label: "Test Bot",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function BotPageTabs({
  botId,
  embedApiKey,
  baseUrl,
  botName,
  documents,
  initialName,
  initialInstructions,
  widgetColor,
  widgetPosition,
  widgetGreeting,
  widgetPlaceholder,
}: BotPageTabsProps) {
  const [activeTab, setActiveTab] = useState("embed");

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl mb-6 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 flex-1 justify-center
              ${activeTab === tab.id
                ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }
            `}
          >
            <span className={activeTab === tab.id ? "text-white/90" : "text-slate-400"}>
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Embed tab */}
      {activeTab === "embed" && (
        <EmbedTab
          botId={botId}
          embedApiKey={embedApiKey}
          baseUrl={baseUrl}
          botName={botName}
          widgetColor={widgetColor}
          widgetPosition={widgetPosition}
          widgetGreeting={widgetGreeting}
          widgetPlaceholder={widgetPlaceholder}
        />
      )}

      {/* Knowledge Base tab */}
      {activeTab === "knowledge" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Knowledge Base</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Your bot will only answer from these documents. Upload PDFs or text files.
                </p>
              </div>
            </div>
            <TipBox
              title="Tips for best results"
              tips={[
                { text: "Upload one clean, well-structured document rather than many small overlapping ones — duplicate content causes repetitive answers." },
                { text: "To update a document, delete the old version first then re-upload. Re-uploading without deleting creates duplicate chunks." },
                { text: "PDFs with clear headings and sections work best. Scanned image PDFs won't extract any content." },
                { text: "The more complete and accurate your content, the better the answers your bot gives." },
              ]}
            />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <DocumentUpload botId={botId} documents={documents} />
          </div>
        </div>
      )}

      {/* Test tab */}
      {activeTab === "test" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Test your bot</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Chat with your bot live — exactly how your website visitors will experience it.
              </p>
            </div>
          </div>
          <BotTester botId={botId} embedApiKey={embedApiKey} botName={botName} />
        </div>
      )}

      {/* Settings tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Bot Settings</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Update your bot&apos;s name, personality, and behavior instructions.
                </p>
              </div>
            </div>
            <TipBox
              title="Writing good instructions"
              tips={[
                { text: "Focus on tone and personality — friendly, formal, concise, detailed. The core behavior is already built in." },
                { text: "Don't include product facts here. Facts belong in uploaded documents, not instructions." },
                { text: 'Good example: "Speak in a friendly, casual tone. Use first names when the customer shares them."' },
                { text: 'Avoid: "Our product costs $X and does Y..." — that belongs in your knowledge base documents.' },
              ]}
            />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <BotSettings
              botId={botId}
              initialName={initialName}
              initialInstructions={initialInstructions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
