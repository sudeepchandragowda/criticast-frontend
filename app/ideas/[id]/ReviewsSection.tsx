"use client";

import { useEffect, useState, useCallback } from "react";
import ReviewForm from "@/components/ReviewForm";
import api from "@/lib/api";

interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewerId: number;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsSection({ ideaId }: { ideaId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal]     = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId]   = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/ideas/${ideaId}/reviews?size=20`);
      setReviews(data.content);
      setTotal(data.totalElements);
    } catch {
      // silently fail
    }
  }, [ideaId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("userId");
    setLoggedIn(!!token);
    if (uid) setUserId(Number(uid));
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Reviews {total > 0 && <span className="text-gray-400 font-normal text-base">({total})</span>}
      </h2>

      {/* Review form — only shown when logged in */}
      {loggedIn ? (
        <div className="mb-8">
          <ReviewForm ideaId={ideaId} onSubmitted={fetchReviews} />
        </div>
      ) : (
        <p className="mb-8 text-sm text-gray-500">
          <a href="/login" className="font-medium text-gray-900 hover:underline">Sign in</a>
          {" "}to leave a review.
        </p>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet. Be the first.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {reviews.map((r) => (
            <div key={r.id} className="py-5">
              {editingId === r.id ? (
                <ReviewForm
                  ideaId={ideaId}
                  initialRating={r.rating}
                  initialComment={r.comment}
                  onSubmitted={() => { setEditingId(null); fetchReviews(); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">
                        {"★".repeat(r.rating)}
                        <span className="text-gray-200">{"★".repeat(5 - r.rating)}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                      {r.updatedAt !== r.createdAt && (
                        <span className="text-xs text-gray-400 italic">· edited</span>
                      )}
                    </div>
                    {userId === r.reviewerId && (
                      <button
                        onClick={() => setEditingId(r.id)}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{r.comment}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
