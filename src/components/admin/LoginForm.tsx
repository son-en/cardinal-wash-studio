"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed.");

      const from = searchParams.get("from");
      router.push(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Email</label>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Password</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-3 text-white outline-none focus:border-accent"
        />
      </div>

      <div className="flex justify-end">
        <span className="cursor-not-allowed text-xs text-faint" title="Contact the studio owner to reset your password">
          Forgot password?
        </span>
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
        {status === "submitting" ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
