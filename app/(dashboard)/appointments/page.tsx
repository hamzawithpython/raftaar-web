"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type Appt = {
  id: string; contact: string; scheduled_for: string; status: string;
  provider_ref: string | null; notes: string | null;
};

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ appointments: Appt[] }>("/internal/dashboard/appointments")
      .then((d) => setAppts(d.appointments))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold text-neutral-900">Appointments</h1>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Scheduled for</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {appts.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">No appointments yet</td></tr>
            ) : (
              appts.map((a) => (
                <tr key={a.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">{a.contact}</td>
                  <td className="px-4 py-3">{new Date(a.scheduled_for).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{a.status}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{a.notes ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}