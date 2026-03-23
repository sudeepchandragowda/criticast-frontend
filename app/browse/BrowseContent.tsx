"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import IdeaCard from "@/components/IdeaCard";
import { browseIdeas } from "@/lib/api";
import { Idea } from "@/types";

const GENRES = [
  "DRAMA", "THRILLER", "COMEDY", "ACTION", "ROMANCE",
  "HORROR", "SCI_FI", "FANTASY", "MYSTERY", "CRIME", "ADVENTURE", "OTHER",
];

export default function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ideas, setIdeas]     = useState<Idea[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);

  const genre  = searchParams.get("genre") ?? "";
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  const fetchIdeas = useCallback(async (g: string, s: string, p: number) => {
    setLoading(true);
    try {
      const data = await browseIdeas({ genre: g || undefined, search: s || undefined, page: p });
      if (p === 0) {
        setIdeas(data.content);
      } else {
        setIdeas((prev) => [...prev, ...data.content]);
      }
      setTotal(data.totalElements);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    fetchIdeas(genre, search, 0);
  }, [genre, search, fetchIdeas]);

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (searchInput) params.set("search", searchInput);
    router.push(`/browse?${params.toString()}`);
  }

  function setGenreFilter(g: string) {
    const params = new URLSearchParams();
    if (g) params.set("genre", g);
    if (search) params.set("search", search);
    router.push(`/browse?${params.toString()}`);
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchIdeas(genre, search, next);
  }

  const hasMore = ideas.length < total;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse ideas</h1>

      {/* Search */}
      <form onSubmit={applySearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or description…"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
        {(search || genre) && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); router.push("/browse"); }}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-500 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setGenreFilter("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !genre ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenreFilter(g)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              genre === g ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {g.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && ideas.length === 0 ? (
        <p className="py-20 text-center text-gray-400 text-sm">Loading…</p>
      ) : ideas.length === 0 ? (
        <p className="py-20 text-center text-gray-400 text-sm">No ideas found.</p>
      ) : (
        <>
          <p className="mb-4 text-xs text-gray-400">{total} idea{total !== 1 ? "s" : ""}</p>
          <div className="flex flex-col">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
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
      )}
    </div>
  );
}
