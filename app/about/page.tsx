import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About · Criticast" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">

      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
        Great ideas shouldn&apos;t need connections. They need proof.
      </h1>

      <p className="mt-6 text-lg text-gray-600 leading-relaxed">
        Criticast is a decision intelligence platform for creative ideas. We give
        creators a structured way to put their concepts in front of real audiences
        and turn subjective reactions into measurable signals.
      </p>

      <hr className="my-10 border-gray-100" />

      <h2 className="text-xl font-semibold text-gray-900">The problem</h2>

      <p className="mt-4 text-gray-600 leading-relaxed">
        In entertainment, the best idea doesn&apos;t always win. The best-connected one
        does. Ideas get pitched behind closed doors, evaluated on gut feeling, and
        greenlit based on who&apos;s in the room. Meanwhile, thousands of genuinely
        compelling concepts never get a fair shot.
      </p>

      <p className="mt-4 text-gray-600 leading-relaxed font-medium text-gray-800">
        Criticast flips that model.
      </p>

      <hr className="my-10 border-gray-100" />

      <h2 className="text-xl font-semibold text-gray-900">How it works</h2>

      <p className="mt-4 text-gray-600 leading-relaxed">
        Creators publish ideas — films, series, ad concepts, stories — then open
        them up for structured evaluation. Audiences review, rate, and react.
        Producers discover ideas that are already showing traction, backed by data
        instead of guesswork.
      </p>

      <p className="mt-4 text-gray-600 leading-relaxed">
        Every idea on Criticast builds a living profile: audience ratings, review
        volume, engagement patterns, and AI-powered insights including sentiment
        analysis, theme extraction, and audience appeal. The result isn&apos;t just
        feedback. It&apos;s a signal that tells you whether something is worth betting on.
      </p>

      <hr className="my-10 border-gray-100" />

      <p className="text-lg text-gray-600 leading-relaxed">
        We&apos;re not a social network. We&apos;re not a writing platform. We&apos;re the layer
        that sits between &ldquo;I have an idea&rdquo; and &ldquo;someone&apos;s willing to produce it&rdquo;
        — powered by real validation, not politics.
      </p>

      <p className="mt-6 text-lg text-gray-600 leading-relaxed italic">
        Criticast turns ideas into evidence.
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
