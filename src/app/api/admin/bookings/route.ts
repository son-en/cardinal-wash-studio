import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { desc } from "drizzle-orm";

export async function GET() {
  return withErrorHandling(async () => {
    const { user, error } = await requireAdmin();
    if (!user) return jsonError(error!, 401);

    const all = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return jsonOk(all);
  });
}
