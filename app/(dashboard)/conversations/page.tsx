"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type Thread = { id: string; channel: string; external_contact: string; status: string; updated_at: string };
type Message = { id: string; direction: string; body: string | null; created_at: string };

export default function ConversationsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ threads: Thread[] }>("/internal/dashboard/threads")
      .then((d) => setThreads(d.threads))
      .catch((e) => setError(e.message));
  }, []);

  function open(id: string) {
    setSelected(id);
    apiGet<{ messages: Message[] }>(`/internal/dashboard/threads/${id}/messages`)
      .then((d) => setMessages(d.messages))
      .catch((e) => setError(e.message));
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-neutral-900">Conversations</h1>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {threads.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-neutral-400">No conversations</p>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => open(t.id)}
                className={`block w-full border-b border-neutral-100 px-4 py-3 text-left text-sm hover:bg-neutral-50 ${selected === t.id ? "bg-neutral-50" : ""}`}
              >
                <span className="font-medium text-neutral-900">{t.external_contact}</span>
                <span className="ml-2 text-xs text-neutral-400">{t.channel}</span>
              </button>
            ))
          )}
        </div>
        <div className="col-span-2 rounded-xl border border-neutral-200 bg-white p-4">
          {!selected ? (
            <p className="py-8 text-center text-sm text-neutral-400">Select a conversation</p>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  m.direction === "inbound" ? "self-start bg-neutral-100 text-neutral-900" : "self-end bg-neutral-900 text-white"
                }`}>
                  {m.body}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}