"use client";

import { useState } from "react";
import { updateIdea, assistWriting } from "@/lib/api";
import { Idea } from "@/types";
import RichTextEditor from "@/components/RichTextEditor";

const GENRES = [
  "DRAMA", "THRILLER", "COMEDY", "ACTION", "ROMANCE",
  "HORROR", "SCI_FI", "FANTASY", "MYSTERY", "CRIME", "ADVENTURE", "OTHER",
];

interface Props {
  idea: Idea;
  onSaved: () => void;
  onCancel: () => void;
}

export default function EditIdeaForm({ idea, onSaved, onCancel }: Props) {
  const [title, setTitle]         = useState(idea.title);
  const [description, setDesc]    = useState(idea.description);
  const [genre, setGenre]         = useState(idea.genre);
  const [scriptUrl, setScriptUrl] = useState(idea.scriptUrl ?? "");
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [assisting, setAssisting] = useState(false);

  async function handleAssist() {
    setAssisting(true);
    try {
      const result = await assistWriting({ title, genre, content: description });
      setDesc(result.content);
    } catch {
      setError("AI assistant failed. Make sure ANTHROPIC_API_KEY is configured.");
    } finally {
      setAssisting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateIdea(idea.id, { title, description, genre, scriptUrl: scriptUrl || undefined });
      onSaved();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not save changes.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 mb-8">
      <h2 className="text-base font-semibold text-gray-900">Edit idea</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <RichTextEditor
          content={description}
          onChange={setDesc}
          onAssist={handleAssist}
          assisting={assisting}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Genre</label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>{g.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Script URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={scriptUrl}
          onChange={(e) => setScriptUrl(e.target.value)}
          placeholder="https://docs.google.com/…"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-6 py-2 text-sm text-gray-600 hover:border-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
