"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import type { Document } from "@prisma/client";

interface DocumentUploadProps {
  botId: string;
  documents: Document[];
}

function statusVariant(status: string): "success" | "warning" | "danger" | "info" {
  if (status === "ready") return "success";
  if (status === "processing") return "info";
  if (status === "failed") return "danger";
  return "warning";
}

export default function DocumentUpload({ botId, documents: initialDocs }: DocumentUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState(initialDocs);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dupWarning, setDupWarning] = useState("");

  async function uploadFile(file: File) {
    setError("");
    setDupWarning("");

    const duplicate = documents.find(
      (d) => d.fileName === file.name && d.status !== "failed"
    );
    if (duplicate) {
      setDupWarning(
        `"${file.name}" is already in the knowledge base. Delete the existing version first to avoid duplicate results.`
      );
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("botId", botId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setDocuments((prev) => [data, ...prev]);
      router.refresh();
      pollDocumentStatus(data.id);
    } finally {
      setUploading(false);
    }
  }

  function pollDocumentStatus(docId: string) {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/bots/${botId}/documents`);
      if (!res.ok) { clearInterval(interval); return; }
      const docs = await res.json();
      setDocuments(docs);
      const doc = docs.find((d: Document) => d.id === docId);
      if (doc && doc.status !== "processing") {
        clearInterval(interval);
        router.refresh();
      }
    }, 3000);
    setTimeout(() => clearInterval(interval), 120000);
  }

  async function deleteDocument(docId: string, fileName: string) {
    if (!confirm(`Delete "${fileName}"? Its chunks will be removed from the knowledge base.`)) return;
    setDeletingId(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
        router.refresh();
      } else {
        setError("Failed to delete document. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${dragOver
            ? "border-violet-400 bg-violet-50"
            : "border-slate-200 hover:border-violet-300 hover:bg-slate-50/80"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,text/plain,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">Uploading and processing...</p>
            <p className="text-xs text-slate-400">This may take a moment</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">
              Drop a file here, or{" "}
              <span className="text-violet-600">click to browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1.5">PDF or TXT files up to 10MB</p>
          </>
        )}
      </div>

      {/* Duplicate warning */}
      {dupWarning && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/80 text-amber-800 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="flex-1">{dupWarning}</span>
          <button onClick={() => setDupWarning("")} className="flex-shrink-0 text-amber-500 hover:text-amber-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{doc.fileName}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <Badge variant={statusVariant(doc.status)}>
                  {doc.status === "processing" ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                      Processing
                    </span>
                  ) : doc.status}
                </Badge>

                <button
                  onClick={() => deleteDocument(doc.id, doc.fileName)}
                  disabled={deletingId === doc.id || doc.status === "processing"}
                  title="Delete document"
                  className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletingId === doc.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
