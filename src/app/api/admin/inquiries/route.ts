import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { desc } from "drizzle-orm";

export async function GET() {
  return withErrorHandling(async () => {
    const { user, error } = await requireAdmin();
    if (!user) return jsonError(error!, 401);

    const all = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    return jsonOk(all);
  });
}
