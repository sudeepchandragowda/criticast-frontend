import { notFound } from "next/navigation";
import ReviewsSection from "./ReviewsSection";
import IdeaActions from "./IdeaActions";

const API = process.env.NEXT_PUBLIC_API_URL;

const GENRE_COLORS: Record<string, string> = {
  DRAMA: "bg-purple-50 text-purple-700", THRILLER: "bg-red-50 text-red-700",
  COMEDY: "bg-yellow-50 text-yellow-700", ACTION: "bg-orange-50 text-orange-700",
  ROMANCE: "bg-pink-50 text-pink-700", HORROR: "bg-gray-100 text-gray-700",
  SCI_FI: "bg-blue-50 text-blue-700", FANTASY: "bg-indigo-50 text-indigo-700",
  MYSTERY: "bg-teal-50 text-teal-700", CRIME: "bg-zinc-100 text-zinc-700",
  ADVENTURE: "bg-green-50 text-green-700", OTHER: "bg-gray-100 text-gray-600",
};

async function getIdea(id: string) {
  const res = await fetch(`${API}/api/ideas/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getInsights(id: string) {
  const res = await fetch(`${API}/api/ideas/${id}/insights`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idea = await getIdea(id);
  if (!idea) notFound();

  const insights = await getInsights(id);
  const genreClass = GENRE_COLORS[idea.genre] ?? GENRE_COLORS.OTHER;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">

      {/* Genre + status */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${genreClass}`}>
          {idea.genre.replace("_", " ")}
        </span>
        {idea.status === "SHORTLISTED" && (
          <span className="rounded-full bg-teal-50 px-3 py-0.5 text-xs font-medium text-teal-700">
            ✦ Shortlisted
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight text-gray-900">{idea.title}</h1>

      {/* Creator + stats */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
          {idea.creatorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{idea.creatorName}</p>
          <p className="text-xs text-gray-400">
            {idea.totalReviews} {idea.totalReviews === 1 ? "review" : "reviews"}
            {idea.totalReviews > 0 && ` · ${idea.avgRating.toFixed(1)} ★`}
          </p>
        </div>
      </div>

      <hr className="my-8 border-gray-100" />

      {/* Edit button — only shown to the creator (client component handles the check) */}
      <IdeaActions idea={idea} />

      {/* Description */}
      <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap mt-4">
        {idea.description}
      </p>

      {/* Edited timestamp */}
      {idea.updatedAt !== idea.createdAt && (
        <p className="mt-3 text-xs text-gray-400">
          Edited {new Date(idea.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      )}

      {/* Script link */}
      {idea.scriptUrl && (
        <a
          href={idea.scriptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900 transition-colors"
        >
          📄 Read the script
        </a>
      )}

      {/* AI Insights */}
      {insights && (
        <>
          <hr className="my-8 border-gray-100" />
          <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
              AI Insights
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{insights.summary}</p>

            {insights.keyThemes?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {insights.keyThemes.map((theme: string) => (
                  <span
                    key={theme}
                    className="rounded-full bg-teal-100 px-3 py-0.5 text-xs text-teal-800"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}

            {insights.producerRecommendation && (
              <p className="mt-4 text-sm text-gray-500 italic">
                &ldquo;{insights.producerRecommendation}&rdquo;
              </p>
            )}

            {insights.isStale && (
              <p className="mt-3 text-xs text-amber-600">
                ⚠ New reviews since last analysis — insights may be outdated.
              </p>
            )}
          </div>
        </>
      )}

      <hr className="my-8 border-gray-100" />

      {/* Reviews — client component handles the form + live list */}
      <ReviewsSection ideaId={idea.id} />
    </div>
  );
}
