"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
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

        {/* Desktop nav links */}
        <nav className="hidden gap-6 text-sm text-gray-600 md:flex">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/browse" className="hover:text-black transition-colors">Browse</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>
        </nav>

        {/* Desktop auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-black transition-colors">Dashboard</Link>
              <Link href="/settings" className="text-sm text-gray-700 hover:text-black transition-colors">Settings</Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:border-gray-500 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-black transition-colors">Sign in</Link>
              <Link href="/register" className="rounded-full bg-black px-4 py-1.5 text-sm text-white hover:bg-gray-800 transition-colors">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-stone-50 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black transition-colors">Home</Link>
          <Link href="/browse" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black transition-colors">Browse</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black transition-colors">About</Link>
          {loggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black transition-colors">Dashboard</Link>
              <Link href="/settings" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black transition-colors">Settings</Link>
              <button onClick={handleSignOut} className="text-left text-gray-700 hover:text-black transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black transition-colors">Sign in</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-full bg-black px-4 py-2 text-center text-white hover:bg-gray-800 transition-colors">
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
