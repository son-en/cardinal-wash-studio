"use client";

import { useState } from "react";
import type { Inquiry } from "@/lib/db/schema";
import Pill from "./Pill";

const statusTone: Record<Inquiry["status"], "neutral" | "success" | "warning" | "info"> = {
  NEW: "warning",
  REPLIED: "info",
  RESOLVED: "success",
};

const statusOptions: Inquiry["status"][] = ["NEW", "REPLIED", "RESOLVED"];

export default function InquiriesInbox({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: Inquiry["status"]) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setInquiries((prev) => prev.map((i) => (i.id === id ? data : i)));
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {inquiries.map((i) => (
        <div key={i.id} className="rounded-xl border border-border bg-panel p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white">{i.customerName}</p>
              <p className="text-xs text-faint">
                {i.channel} · {new Date(i.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone={statusTone[i.status]}>{i.status}</Pill>
              <select
                value={i.status}
                disabled={pendingId === i.id}
                onChange={(e) => updateStatus(i.id, e.target.value as Inquiry["status"])}
                className="rounded-md border border-border bg-panel-2 px-2 py-1 text-xs font-semibold text-white outline-none focus:border-accent disabled:opacity-50"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted">{i.message}</p>
        </div>
      ))}
      {inquiries.length === 0 && (
        <p className="rounded-xl border border-border bg-panel p-6 text-center text-faint">
          No inquiries yet.
        </p>
      )}
    </div>
  );
}
