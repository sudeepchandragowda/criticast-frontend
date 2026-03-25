"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";
import api from "@/lib/api";
import { User } from "@/types";

const ROLES = [
  { value: "VIEWER",   label: "Viewer",   desc: "Browse and review ideas" },
  { value: "CREATOR",  label: "Creator",  desc: "Pitch your own ideas" },
  { value: "PRODUCER", label: "Producer", desc: "Discover and shortlist ideas" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser]       = useState<User | null>(null);
  const [name, setName]       = useState("");
  const [role, setRole]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.replace("/login"); return; }
    getMe().then((me) => {
      setUser(me);
      setName(me.name);
      setRole(me.role);
    }).catch(() => router.replace("/login"));
  }, [router]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      await api.patch("/api/users/me", { name });
      setMessage("Name updated.");
    } catch {
      setError("Could not update name.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveRole() {
    setSaving(true); setMessage(""); setError("");
    try {
      await api.patch("/api/users/me/role", { role });
      setMessage("Role updated. Sign out and back in for changes to take effect.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not update role.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-sm text-gray-400">Loading…</p></div>;
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Account info */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Account</h2>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {user.email}</p>
          <p className="text-sm text-gray-700"><span className="font-medium">Verified:</span> {user.emailVerified ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Name */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Display name</h2>
        <form onSubmit={handleSaveName} className="flex gap-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Save
          </button>
        </form>
      </div>

      {/* Role */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Role</h2>
        <div className="flex flex-col gap-2 mb-4">
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
        <button
          onClick={handleSaveRole}
          disabled={saving || role === user.role}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Save role
        </button>
      </div>

      {message && <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
