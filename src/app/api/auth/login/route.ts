import { NextRequest } from "next/server";
import { authenticate, createSessionToken, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const key = clientKeyFromRequest(request, "auth:login");
    // Deliberately tight: 5 attempts/minute per IP to slow down credential stuffing.
    const { success } = rateLimit(key, { limit: 5, windowMs: 60_000 });
    if (!success) return jsonError("Too many login attempts. Please try again shortly.", 429);

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await authenticate(email, password);
    if (!user) {
      return jsonError("Invalid email or password.", 401);
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await setSessionCookie(token);

    return jsonOk({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
}
