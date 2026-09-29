"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTopBar({ name }: { name: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="font-display text-xl text-white">
          Cardinal <span className="text-accent">Wash</span> Studio
          <span className="ml-2 text-xs font-sans font-normal normal-case tracking-normal text-faint">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted">{name}</span>
          <Link href="/" className="text-muted hover:text-white">
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-border px-4 py-1.5 font-medium text-white hover:border-white"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
