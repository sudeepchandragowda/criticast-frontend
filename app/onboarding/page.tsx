"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const ROLES = [
  { value: "VIEWER",   label: "Viewer",   desc: "Browse and review ideas" },
  { value: "CREATOR",  label: "Creator",  desc: "Pitch your own ideas" },
  { value: "PRODUCER", label: "Producer", desc: "Discover and shortlist ideas" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole]       = useState("VIEWER");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/login");
  }, [router]);

  async function handleContinue() {
    setSaving(true);
    setError("");
    try {
      await api.patch("/api/users/me/role", { role });
      router.replace("/");
    } catch {
      setError("Could not save your role. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Criticast.</h1>
          <p className="mt-2 text-sm text-gray-500">How would you like to use Criticast?</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                role === r.value
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="mt-0.5 accent-black"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{r.label}</p>
                <p className="text-xs text-gray-500">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={saving}
          className="w-full rounded-full bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Continue"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          You can change this anytime in Settings.
        </p>
      </div>
    </div>
  );
}
