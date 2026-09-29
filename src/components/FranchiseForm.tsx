"use client";

import { useState, FormEvent } from "react";

export default function FranchiseForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      contactInfo: form.get("contactInfo"),
      preferredCity: form.get("preferredCity"),
      modelInterest: form.get("modelInterest"),
    };

    try {
      const res = await fetch("/api/franchise-leads", {
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
        <h3 className="font-display text-2xl text-white">Thanks for your interest!</h3>
        <p className="mt-2 text-muted">
          Our franchise team will reach out within 2–3 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Full Name</label>
        <input
          name="name"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">
          Email or Phone Number
        </label>
        <input
          name="contactInfo"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Preferred City</label>
        <input
          name="preferredCity"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Model of Interest</label>
        <select
          name="modelInterest"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        >
          <option value="FULL_STUDIO">Full Studio</option>
          <option value="EXPRESS_BAY">Express Bay</option>
        </select>
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
        {status === "submitting" ? "Sending..." : "Submit Interest"}
      </button>
    </form>
  );
}
