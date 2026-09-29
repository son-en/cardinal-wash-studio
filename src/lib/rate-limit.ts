// Minimal in-memory sliding-window rate limiter for a single-instance deploy.
// Good enough for a small business site behind Vercel's own DDoS protection;
// swap for Upstash Redis (@upstash/ratelimit) if you move to multi-region /
// serverless-per-request scaling where in-memory state won't be shared.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = { success: boolean; remaining: number };

export function rateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0 };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count };
}

export function clientKeyFromRequest(request: Request, prefix: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
