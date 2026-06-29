"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type Lead = {
  id: string; intent: string | null; interest: string | null; location: string | null;
  budget: string | null; score: number | null; stage: string; qualified: boolean | null;
  contact: string; created_at: string;
};
type Summary = { leads: number; qualified: number; appointments_booked: number; escalations_open: number };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<Summary>("/internal/dashboard/summary"),
      apiGet<{ leads: Lead[] }>("/internal/dashboard/leads"),
    ])
      .then(([s, l]) => { setSummary(s); setLeads(l.leads); })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold text-neutral-900">Leads</h1>
      {summary && (
        <div className="mt-6 grid grid-cols-4 gap-4">
          <Card label="Total leads" value={summary.leads} />
          <Card label="Qualified" value={summary.qualified} />
          <Card label="Booked" value={summary.appointments_booked} />
          <Card label="Escalations" value={summary.escalations_open} />
        </div>
      )}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Intent</th>
              <th className="px-4 py-3 font-medium">Interest</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">No leads yet</td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">{l.contact}</td>
                  <td className="px-4 py-3">{l.intent ?? "-"}</td>
                  <td className="px-4 py-3">{l.interest ?? "-"}</td>
                  <td className="px-4 py-3">{l.location ?? "-"}</td>
                  <td className="px-4 py-3">{l.score ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${l.qualified ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
                      {l.stage}
                    </span>
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

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}