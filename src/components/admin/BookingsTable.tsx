"use client";

import { useState } from "react";
import type { Booking } from "@/lib/db/schema";
import Pill from "./Pill";

const paymentTone: Record<Booking["paymentStatus"], "neutral" | "success" | "warning" | "danger" | "info"> = {
  UNPAID: "neutral",
  PAID_DOWNPAYMENT: "warning",
  PAID: "success",
  REFUNDED: "danger",
};

const statusOptions: Booking["status"][] = [
  "PENDING",
  "CONFIRMED",
  "IN_SERVICE",
  "COMPLETED",
  "CANCELLED",
];

export default function BookingsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: Booking["status"]) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-panel-2 text-xs uppercase tracking-wide text-faint">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Schedule</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-panel">
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-white">{b.customerName}</p>
                <p className="text-xs text-faint">{b.phone}</p>
              </td>
              <td className="px-4 py-3 text-muted">{b.vehicleModel}</td>
              <td className="px-4 py-3 text-muted">{b.serviceType}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(b.requestedDatetime).toLocaleString("en-PH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
              <td className="px-4 py-3">
                <Pill tone={paymentTone[b.paymentStatus]}>{b.paymentStatus.replace("_", " ")}</Pill>
              </td>
              <td className="px-4 py-3">
                <select
                  value={b.status}
                  disabled={pendingId === b.id}
                  onChange={(e) => updateStatus(b.id, e.target.value as Booking["status"])}
                  className="rounded-md border border-border bg-panel-2 px-2 py-1.5 text-xs font-semibold text-white outline-none focus:border-accent disabled:opacity-50"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-faint">
                No bookings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
