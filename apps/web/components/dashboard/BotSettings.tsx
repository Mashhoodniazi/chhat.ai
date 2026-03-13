"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

interface BotSettingsProps {
  botId: string;
  initialName: string;
  initialInstructions: string;
}

export default function BotSettings({
  botId,
  initialName,
  initialInstructions,
}: BotSettingsProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [instructions, setInstructions] = useState(initialInstructions);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, instructions }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${name}"? This will delete all documents and conversations. This cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/bots/${botId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <Input
        label="Bot Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        label="Personality & Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={5}
        hint="Define the bot's tone and any extra rules. Leave blank for the default friendly style. It always answers only from its knowledge base."
      />

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Settings saved successfully.
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
        <Button
          type="button"
          variant="danger"
          loading={deleteLoading}
          onClick={handleDelete}
        >
          Delete Bot
        </Button>
      </div>
    </form>
  );
}
