"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setBusy(true);
    setError(null);
    try {
      const { access_token } = await login(email.trim());
      setToken(access_token);
      router.push("/leads");
    } catch (e) {
      setError(e instanceof Error ? e.message : "login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">RaftaarAI</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to your dashboard</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="you@example.com"
          className="mt-6 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={busy || !email}
          className="mt-4 w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </main>
  );
}