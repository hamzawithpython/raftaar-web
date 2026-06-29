"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { clearToken, getToken } from "@/lib/api";

const NAV = [
  { href: "/leads", label: "Leads" },
  { href: "/conversations", label: "Conversations" },
  { href: "/appointments", label: "Appointments" },
  { href: "/escalations", label: "Escalations" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.push("/login");
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  function signOut() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <span className="font-semibold text-neutral-900">RaftaarAI</span>
          <nav className="flex gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  pathname === n.href
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button onClick={signOut} className="text-sm text-neutral-500 hover:text-neutral-900">
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-8">{children}</main>
    </div>
  );
}