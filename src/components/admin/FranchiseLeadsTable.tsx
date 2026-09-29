"use client";

import { useState } from "react";
import type { FranchiseLead } from "@/lib/db/schema";
import Pill from "./Pill";

const statusTone: Record<FranchiseLead["status"], "neutral" | "success" | "warning" | "info" | "danger"> = {
  NEW: "warning",
  CONTACTED: "info",
  QUALIFIED: "success",
  DECLINED: "danger",
};

const statusOptions: FranchiseLead["status"][] = ["NEW", "CONTACTED", "QUALIFIED", "DECLINED"];

export default function FranchiseLeadsTable({
  initialLeads,
}: {
  initialLeads: FranchiseLead[];
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: FranchiseLead["status"]) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/franchise-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === id ? data : l)));
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-panel-2 text-xs uppercase tracking-wide text-faint">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-panel">
          {leads.map((l) => (
            <tr key={l.id}>
              <td className="px-4 py-3 font-medium text-white">{l.name}</td>
              <td className="px-4 py-3 text-muted">{l.contactInfo}</td>
              <td className="px-4 py-3 text-muted">{l.preferredCity}</td>
              <td className="px-4 py-3 text-muted">{l.modelInterest.replace("_", " ")}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Pill tone={statusTone[l.status]}>{l.status}</Pill>
                  <select
                    value={l.status}
                    disabled={pendingId === l.id}
                    onChange={(e) => updateStatus(l.id, e.target.value as FranchiseLead["status"])}
                    className="rounded-md border border-border bg-panel-2 px-2 py-1 text-xs font-semibold text-white outline-none focus:border-accent disabled:opacity-50"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-faint">
                No franchise leads yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
