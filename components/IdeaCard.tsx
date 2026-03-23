import Link from "next/link";
import { Idea } from "@/types";

const GENRE_COLORS: Record<string, string> = {
  DRAMA:     "bg-purple-50 text-purple-700",
  THRILLER:  "bg-red-50 text-red-700",
  COMEDY:    "bg-yellow-50 text-yellow-700",
  ACTION:    "bg-orange-50 text-orange-700",
  ROMANCE:   "bg-pink-50 text-pink-700",
  HORROR:    "bg-gray-100 text-gray-700",
  SCI_FI:    "bg-blue-50 text-blue-700",
  FANTASY:   "bg-indigo-50 text-indigo-700",
  MYSTERY:   "bg-teal-50 text-teal-700",
  CRIME:     "bg-zinc-100 text-zinc-700",
  ADVENTURE: "bg-green-50 text-green-700",
  OTHER:     "bg-gray-100 text-gray-600",
};

function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span className="flex items-center gap-0.5 text-amber-400 text-xs">
      {"★".repeat(full)}{"☆".repeat(empty)}
      <span className="ml-1 text-gray-500 font-normal">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function IdeaCard({ idea }: { idea: Idea }) {
  const genreClass = GENRE_COLORS[idea.genre] ?? GENRE_COLORS.OTHER;
  const excerpt =
    idea.description.length > 120
      ? idea.description.slice(0, 120) + "…"
      : idea.description;

  return (
    <Link href={`/ideas/${idea.id}`} className="group block">
      <article className="flex flex-col gap-3 border-b border-gray-100 py-6 transition-colors hover:bg-gray-50 px-2 rounded-lg">
        {/* Creator */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-semibold">
            {idea.creatorName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{idea.creatorName}</span>
        </div>

        {/* Title + excerpt */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-black">
              {idea.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {excerpt}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className={`rounded-full px-2.5 py-0.5 font-medium ${genreClass}`}>
            {idea.genre.replace("_", " ")}
          </span>
          {idea.totalReviews > 0 && <StarRating rating={idea.avgRating} />}
          <span>{idea.totalReviews} {idea.totalReviews === 1 ? "review" : "reviews"}</span>
        </div>
      </article>
    </Link>
  );
}
