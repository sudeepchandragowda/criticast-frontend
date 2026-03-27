"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditIdeaForm from "./EditIdeaForm";
import { Idea, User } from "@/types";
import { getMe, addShortlist, removeShortlist, checkShortlist } from "@/lib/api";

export default function IdeaActions({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getMe()
      .then((me) => {
        setUser(me);
        if (me.role === "PRODUCER" || me.role === "ADMIN") {
          return checkShortlist(idea.id).then(setShortlisted);
        }
      })
      .catch(() => {});
  }, [idea.id]);

  const isCreator = user !== null && user.id === idea.creatorId;
  const isProducerOrAdmin = user !== null && (user.role === "PRODUCER" || user.role === "ADMIN");
  const canShortlist = isProducerOrAdmin && idea.status === "PUBLISHED";

  async function handleToggleShortlist() {
    setToggling(true);
    try {
      if (shortlisted) {
        await removeShortlist(idea.id);
        setShortlisted(false);
      } else {
        await addShortlist(idea.id);
        setShortlisted(true);
      }
    } catch {
      alert("Could not update shortlist.");
    } finally {
      setToggling(false);
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

  if (!isCreator && !canShortlist) return null;

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
          onClick={handleToggleShortlist}
          disabled={toggling}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
            shortlisted
              ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {toggling ? "Updating…" : shortlisted ? "✦ Shortlisted" : "✦ Shortlist"}
        </button>
      )}
    </div>
  );
}
