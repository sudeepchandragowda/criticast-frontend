"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if a token exists in localStorage when the component mounts
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-stone-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Wordmark */}
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Criticast
        </Link>

        {/* Nav links */}
        <nav className="hidden gap-6 text-sm text-gray-600 md:flex">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/browse" className="hover:text-black transition-colors">
            Browse
          </Link>
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:border-gray-500 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:text-black transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-black px-4 py-1.5 text-sm text-white hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
