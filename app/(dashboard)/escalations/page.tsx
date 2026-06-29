"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Escalation = {
  id: string; reason: string; status: string; run_id: string | null;
  context: Record<string, unknown>; created_at: string | null;
};

export default function EscalationsPage() {
  const [items, setItems] = useState<Escalation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function load() {
    apiGet<{ escalations: Escalation[] }>("/internal/escalations")
      .then((d) => setItems(d.escalations))
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function resolve(id: string) {
    setBusy(id);
    setError(null);
    try {
      await apiPost(`/internal/escalations/${id}/resolve`, { resolution: "Handled via dashboard" });
      load(); // resolved drops off the open list; the parked run resumes server-side
    } catch (e) {
      setError(e instanceof Error ? e.message : "resolve failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-neutral-900">Escalations</h1>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Summary</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">No open escalations</td></tr>
            ) : (
              items.map((e) => (
                <tr key={e.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">{e.reason}</td>
                  <td className="px-4 py-3 text-neutral-500">{String(e.context?.summary ?? "-")}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{e.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => resolve(e.id)}
                      disabled={busy === e.id}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                    >
                      {busy === e.id ? "Resolving..." : "Resolve"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}