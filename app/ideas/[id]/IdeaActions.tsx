"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditIdeaForm from "./EditIdeaForm";
import { Idea } from "@/types";

export default function IdeaActions({ idea }: { idea: Idea }) {
  const router = useRouter();
  const [isCreator, setIsCreator] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Decode the JWT to get the user's email, then compare with idea.creatorId
    // Simpler: store userId in localStorage on login
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // JWT sub is email — we check creatorName as a rough match,
      // but ideally compare userId. Store userId on login for accuracy.
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId && Number(storedUserId) === idea.creatorId) {
        setIsCreator(true);
      }
    } catch {
      // ignore
    }
  }, [idea.creatorId]);

  if (!isCreator) return null;

  if (editing) {
    return (
      <EditIdeaForm
        idea={idea}
        onSaved={() => { setEditing(false); router.refresh(); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-4"
    >
      Edit idea
    </button>
  );
}
