"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiGet } from "@/lib/api";

type Lead = {
  id: string; intent: string | null; interest: string | null; location: string | null;
  budget: string | null; urgency: string | null; score: number | null; stage: string;
  qualified: boolean | null; summary: string | null; contact: string; created_at: string;
};
type Appt = {
  id: string; lead_id: string | null; contact: string; scheduled_for: string | null;
  status: string; notes: string | null;
};

export default function LeadDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [lead, setLead] = useState<Lead | null>(null);
  const [appt, setAppt] = useState<Appt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Lead>(`/internal/dashboard/leads/${id}`)
      .then(setLead)
      .catch((e) => setError(e.message));
    apiGet<{ appointments: Appt[] }>("/internal/dashboard/appointments")
      .then((r) => setAppt(r.appointments.find((a) => a.lead_id === id) ?? null))
      .catch(() => {});
  }, [id]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!lead) return <p className="text-sm text-neutral-500">Loading…</p>;

  const fields: [string, string | number | null][] = [
    ["Intent", lead.intent], ["Interest", lead.interest], ["Location", lead.location],
    ["Budget", lead.budget], ["Urgency", lead.urgency], ["Score", lead.score],
  ];

  return (
    <>
      <div className="flex items-center gap-3">
        <Link href="/leads" className="text-sm text-neutral-500 hover:text-neutral-900">← Leads</Link>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">{lead.contact}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          lead.qualified ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
          {lead.qualified ? "Qualified" : lead.stage}
        </span>
      </div>

      {lead.summary && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{lead.summary}</p>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">AI-extracted fields</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-400">{label}</p>
              <p className="mt-1 text-lg font-medium text-neutral-900">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Appointment</h2>
        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-4">
          {appt ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Scheduled for</p>
                <p className="mt-1 text-lg font-medium text-neutral-900">
                  {appt.scheduled_for ? new Date(appt.scheduled_for).toLocaleString() : "—"}
                </p>
                {appt.notes && <p className="mt-1 text-sm text-neutral-500">{appt.notes}</p>}
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {appt.status}
              </span>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No appointment booked — this lead was escalated to a human.</p>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-neutral-400">
        Lead ID {lead.id} · captured {new Date(lead.created_at).toLocaleString()}
      </p>
    </>
  );
}