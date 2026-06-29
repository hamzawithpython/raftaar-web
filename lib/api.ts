// Minimal API client for the RaftaarAI dashboard.
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

const TOKEN_KEY = "raftaar_token";

export function setToken(token: string) {
  if (typeof window !== "undefined") sessionStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  if (typeof window !== "undefined") sessionStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string): Promise<{ access_token: string }> {
  const res = await fetch(`${BASE}/internal/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? "login failed");
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
  return res.json();
}