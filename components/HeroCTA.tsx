"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroCTA() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  if (loggedIn) {
    return (
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/browse"
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-500 transition-colors"
        >
          Browse ideas
        </Link>
      </div>
    );
  }

  return (
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
  );
}
