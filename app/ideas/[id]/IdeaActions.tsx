"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditIdeaForm from "./EditIdeaForm";
import { Idea, User } from "@/types";
import { getMe, shortlistIdea } from "@/lib/api";

export default function IdeaActions({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [shortlisting, setShortlisting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getMe().then(setUser).catch(() => {});
  }, []);

  const isCreator = user !== null && user.id === idea.creatorId;
  const isProducerOrAdmin = user !== null && (user.role === "PRODUCER" || user.role === "ADMIN");
  const canShortlist = isProducerOrAdmin && idea.status === "PUBLISHED";
  const isShortlisted = idea.status === "SHORTLISTED";

  async function handleShortlist() {
    setShortlisting(true);
    try {
      await shortlistIdea(idea.id);
      router.refresh();
    } catch {
      alert("Could not shortlist this idea.");
    } finally {
      setShortlisting(false);
    }
  }

  if (editing) {
    return (
      <EditIdeaForm
        idea={idea}
        onSaved={() => { setEditing(false); router.refresh(); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (!isCreator && !canShortlist && !isShortlisted) return null;

  return (
    <div className="flex items-center gap-3 mb-4">
      {isCreator && (
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-4"
        >
          Edit idea
        </button>
      )}
      {canShortlist && (
        <button
          onClick={handleShortlist}
          disabled={shortlisting}
          className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {shortlisting ? "Shortlisting…" : "✦ Shortlist"}
        </button>
      )}
      {isShortlisted && isProducerOrAdmin && (
        <span className="rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
          ✦ Shortlisted by you
        </span>
      )}
    </div>
  );
}
