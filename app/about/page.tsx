import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About · Criticast" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">

      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
        Everyone has an idea worth hearing.
      </h1>

      <p className="mt-6 text-lg text-gray-600 leading-relaxed">
        Criticast is a place for creative people to pitch their ideas — short films,
        stories, ad concepts, AI videos, web series — and get honest feedback from
        people who genuinely care about good work.
      </p>

      <p className="mt-5 text-lg text-gray-600 leading-relaxed">
        Most ideas never leave someone's notes app. Not because they're bad, but
        because there's no place to put them out into the world and ask: <em>does
        this resonate?</em> Criticast is that place.
      </p>

      <hr className="my-10 border-gray-100" />

      <h2 className="text-xl font-semibold text-gray-900">How it works</h2>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">Creators</p>
          <p className="mt-1 text-gray-600 leading-relaxed">
            Write up your idea, add context, attach a script or video if you have one.
            Publish it and let the world weigh in.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">Reviewers</p>
          <p className="mt-1 text-gray-600 leading-relaxed">
            Browse ideas across genres, rate them, and leave a review. Your feedback
            helps creators sharpen their work and helps great ideas rise to the top.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">Producers</p>
          <p className="mt-1 text-gray-600 leading-relaxed">
            Discover ideas that are ready to be made. Shortlist the ones that excite
            you and connect with the creators behind them.
          </p>
        </div>
      </div>

      <hr className="my-10 border-gray-100" />

      <p className="text-lg text-gray-600 leading-relaxed">
        We also use AI to help — to polish your pitch, surface insights from reviews,
        and recommend ideas you're likely to love. But the heart of Criticast is
        human: real ideas, real opinions, real potential.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/register"
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Start pitching
        </Link>
        <Link
          href="/browse"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-500 transition-colors"
        >
          Browse ideas
        </Link>
      </div>

    </div>
  );
}
