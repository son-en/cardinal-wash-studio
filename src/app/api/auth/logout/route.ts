import { clearSessionCookie } from "@/lib/auth";
import { jsonOk, withErrorHandling } from "@/lib/api-helpers";

export async function POST() {
  return withErrorHandling(async () => {
    await clearSessionCookie();
    return jsonOk({ ok: true });
  });
}
