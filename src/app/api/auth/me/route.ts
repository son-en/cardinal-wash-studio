import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";

export async function GET() {
  return withErrorHandling(async () => {
    const user = await getCurrentUser();
    if (!user) return jsonError("Not authenticated", 401);
    return jsonOk(user);
  });
}
