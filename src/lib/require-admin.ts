import { getCurrentUser } from "@/lib/auth";

/**
 * Defense-in-depth auth check for admin API routes. `proxy.ts` already
 * blocks unauthenticated requests to /api/admin/*, but per Next.js's own
 * guidance, Proxy matchers can silently stop covering a route after a
 * refactor — so every admin route re-checks the session itself rather than
 * trusting Proxy alone.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, error: "Unauthorized" as const };
  }
  return { user, error: null };
}
