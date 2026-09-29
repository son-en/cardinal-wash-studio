"use client";

import { useState, FormEvent } from "react";
import type { Service } from "@/lib/db/schema";

const vehicleSizes = [
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV / Crossover" },
  { value: "VAN", label: "Van" },
  { value: "PICKUP", label: "Pickup" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
];

export default function BookingForm({ services }: { services: Service[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      email: form.get("email"),
      vehicleSize: form.get("vehicleSize"),
      vehicleModel: form.get("vehicleModel"),
      serviceType: form.get("serviceType"),
      requestedDatetime: form.get("requestedDatetime"),
      notes: form.get("notes"),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-success/30 bg-success-tint p-8 text-center">
        <h3 className="font-display text-2xl text-white">Booking Request Sent!</h3>
        <p className="mt-2 text-muted">
          We&rsquo;ll confirm your appointment shortly via SMS or email. Thank you for
          choosing Cardinal Wash Studio.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-md border border-border px-5 py-2 text-sm font-medium text-white hover:border-white"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" name="customerName" required />
        <Field label="Phone Number" name="phone" type="tel" required />
      </div>
      <Field label="Email Address" name="email" type="email" required />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">Vehicle Size</label>
          <select
            name="vehicleSize"
            required
            className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
          >
            {vehicleSizes.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Vehicle Model" name="vehicleModel" placeholder="e.g. Toyota Vios 2022" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Service</label>
        <select
          name="serviceType"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        >
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name} — ₱{s.price.toLocaleString()}
            </option>
          ))}
        </select>
      </div>
      <Field
        label="Preferred Date & Time"
        name="requestedDatetime"
        type="datetime-local"
        required
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Notes (optional)</label>
        <textarea
          name="notes"
          rows={3}
          maxLength={500}
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
          placeholder="Anything we should know?"
        />
      </div>

      {status === "error" && (
        <p className="rounded-md border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Request Booking"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
      />
    </div>
  );
}
