"use client";

import { useState } from "react";
import IdeaCard from "@/components/IdeaCard";
import { Idea } from "@/types";
import { getTopIdeas } from "@/lib/api";

export default function LoadMoreIdeas({ initialIdeas, initialTotal }: {
  initialIdeas: Idea[];
  initialTotal: number;
}) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const hasMore = ideas.length < initialTotal;

  async function loadMore() {
    setLoading(true);
    try {
      const next = page + 1;
      const data = await getTopIdeas(next, 12);
      setIdeas((prev) => [...prev, ...data.content]);
      setPage(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm text-gray-600 hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
