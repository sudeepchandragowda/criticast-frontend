// Render this page on every request instead of pre-building it at deploy time.
// This avoids build timeouts caused by the backend's cold-start delay.
export const dynamic = "force-dynamic";

import Link from "next/link";
import IdeaCard from "@/components/IdeaCard";
import { Idea, Page } from "@/types";

// This is an async server component.
// Next.js runs this function on the server, fetches the data, and sends
// fully-rendered HTML to the browser — no loading spinner on first visit.
async function fetchTopIdeas(): Promise<Idea[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ideas/top?page=0&size=12`,
      { next: { revalidate: 60 } } // refresh cached data every 60 seconds
    );
    if (!res.ok) return [];
    const data: Page<Idea> = await res.json();
    return data.content;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const ideas = await fetchTopIdeas();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="border-b border-gray-100 py-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(91,196,190,0.12) 0%, transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="text-6xl font-bold leading-tight tracking-tight text-gray-900">
            Creative ideas &amp; honest critique.
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            A place to pitch, review, and discover what&apos;s worth making.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-500 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Idea feed ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Trending on Criticast
          </h2>
          <Link
            href="/browse"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            See all →
          </Link>
        </div>

        {ideas.length === 0 ? (
          <p className="py-20 text-center text-gray-400">
            No ideas published yet. Be the first!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
