"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
  ideaId: number;
  onSubmitted: () => void; // called after a successful review so the list can refresh
}

export default function ReviewForm({ ideaId, onSubmitted }: Props) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0); // which star the cursor is on
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setError("");
    setLoading(true);

    try {
      await api.post(`/api/ideas/${ideaId}/reviews`, { rating, comment });
      setRating(0);
      setComment("");
      onSubmitted();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not submit review. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Star picker */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl transition-colors"
          >
            <span className={(hovered || rating) >= star ? "text-amber-400" : "text-gray-300"}>
              ★
            </span>
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-500">{rating} / 5</span>
        )}
      </div>

      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts on this idea…"
        rows={3}
        maxLength={500}
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none resize-none"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
