"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please use the link from your email.");
      return;
    }

    api
      .get(`/api/auth/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch((err) => {
        const msg =
          err?.response?.data?.message ?? "This link is invalid or has expired.";
        setStatus("error");
        setMessage(msg);
      });
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-400">Verifying your email…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900">Email verified.</h1>
          <p className="mt-3 text-sm text-gray-500">
            Your account is now fully active. You can sign in and start exploring.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 text-4xl">✗</div>
        <h1 className="text-2xl font-bold text-gray-900">Verification failed.</h1>
        <p className="mt-3 text-sm text-gray-500">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-500 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
