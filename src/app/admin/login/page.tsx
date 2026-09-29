import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-2xl text-white">
          Cardinal <span className="text-accent">Wash</span> Studio
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-white">
          ← Back to site
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[440px] rounded-2xl border border-border bg-panel p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint text-2xl">
              🔒
            </div>
            <h1 className="font-display text-2xl text-white">Admin Login</h1>
            <p className="mt-1 text-sm text-muted">
              Sign in to manage bookings and inquiries.
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-xs text-faint">
            Restricted access — Cardinal Wash Studio staff only.
          </p>
        </div>
      </div>
    </div>
  );
}
