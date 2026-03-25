"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMe, getMyIdeas, createIdea, publishIdea, deleteIdea, assistWriting } from "@/lib/api";
import { Idea, User } from "@/types";
import RichTextEditor from "@/components/RichTextEditor";

const GENRES = [
  "DRAMA", "THRILLER", "COMEDY", "ACTION", "ROMANCE",
  "HORROR", "SCI_FI", "FANTASY", "MYSTERY", "CRIME", "ADVENTURE", "OTHER",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]     = useState<User | null>(null);
  const [ideas, setIdeas]   = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle]         = useState("");
  const [description, setDesc]    = useState("");
  const [genre, setGenre]         = useState("DRAMA");
  const [scriptUrl, setScriptUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assisting, setAssisting] = useState(false);

  async function loadData() {
    try {
      const [me, page] = await Promise.all([getMe(), getMyIdeas()]);
      setUser(me);
      setIdeas(page.content);
    } catch {
      // Not logged in — redirect
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAssist() {
    setAssisting(true);
    try {
      const result = await assistWriting({ title, genre, content: description });
      setDesc(result.content);
    } catch {
      setFormError("AI assistant failed. Make sure ANTHROPIC_API_KEY is configured.");
    } finally {
      setAssisting(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await createIdea({ title, description, genre, scriptUrl: scriptUrl || undefined });
      setTitle(""); setDesc(""); setGenre("DRAMA"); setScriptUrl("");
      setShowForm(false);
      loadData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not create idea.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(id: number) {
    try {
      await publishIdea(id);
      loadData();
    } catch {
      alert("Could not publish this idea.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this idea? This cannot be undone.")) return;
    try {
      await deleteIdea(id);
      loadData();
    } catch {
      alert("Could not delete this idea.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  const drafts    = ideas.filter((i) => i.status === "DRAFT");
  const published = ideas.filter((i) => i.status !== "DRAFT");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{user?.name} · {user?.role}</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          {showForm ? "Cancel" : "+ New idea"}
        </button>
      </div>

      {/* Email verification warning */}
      {user && !user.emailVerified && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700">
          Please verify your email address to publish ideas.
        </div>
      )}

      {/* New idea form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-10 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-base font-semibold text-gray-900">New idea</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A compelling title…"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <RichTextEditor
              content={description}
              onChange={setDesc}
              placeholder="Describe your idea in detail…"
              onAssist={handleAssist}
              assisting={assisting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Script URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              placeholder="https://docs.google.com/…"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{formError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save draft"}
          </button>
        </form>
      )}

      {/* Ideas list */}
      {ideas.length === 0 ? (
        <p className="py-16 text-center text-gray-400 text-sm">
          You haven&apos;t posted any ideas yet.
        </p>
      ) : (
        <>
          {drafts.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Drafts
              </h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {drafts.map((idea) => (
                  <IdeaRow
                    key={idea.id}
                    idea={idea}
                    onPublish={() => handlePublish(idea.id)}
                    onDelete={() => handleDelete(idea.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {published.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Published
              </h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {published.map((idea) => (
                  <IdeaRow
                    key={idea.id}
                    idea={idea}
                    onDelete={() => handleDelete(idea.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function IdeaRow({
  idea,
  onPublish,
  onDelete,
}: {
  idea: Idea;
  onPublish?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <Link
          href={`/ideas/${idea.id}`}
          className="text-sm font-semibold text-gray-900 hover:underline truncate block"
        >
          {idea.title}
        </Link>
        <p className="mt-0.5 text-xs text-gray-400">
          {idea.totalReviews} {idea.totalReviews === 1 ? "review" : "reviews"}
          {idea.totalReviews > 0 && ` · ${idea.avgRating.toFixed(1)} ★`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onPublish && (
          <button
            onClick={onPublish}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-gray-500 transition-colors"
          >
            Publish
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded-full border border-red-100 px-3 py-1 text-xs text-red-500 hover:border-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
