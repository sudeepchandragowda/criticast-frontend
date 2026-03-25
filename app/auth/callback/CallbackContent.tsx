"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token        = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const userId       = searchParams.get("userId");
    const isNewUser    = searchParams.get("isNewUser") === "true";

    if (!token) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (userId) localStorage.setItem("userId", userId);

    if (isNewUser) {
      router.replace("/onboarding");
    } else {
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-gray-400">Signing you in…</p>
    </div>
  );
}
