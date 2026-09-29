import { db } from "@/lib/db";
import { bookings, inquiries, franchiseLeads } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  return withErrorHandling(async () => {
    const { user, error } = await requireAdmin();
    if (!user) return jsonError(error!, 401);

    const [pendingBookings] = await db
      .select({ n: count() })
      .from(bookings)
      .where(eq(bookings.status, "PENDING"));

    const [newInquiries] = await db
      .select({ n: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "NEW"));

    const [newLeads] = await db
      .select({ n: count() })
      .from(franchiseLeads)
      .where(eq(franchiseLeads.status, "NEW"));

    const [revenue] = await db
      .select({ total: sql<number>`coalesce(sum(${bookings.downpaymentAmount}), 0)` })
      .from(bookings);

    return jsonOk({
      pendingBookings: pendingBookings?.n ?? 0,
      newInquiries: newInquiries?.n ?? 0,
      newFranchiseLeads: newLeads?.n ?? 0,
      collectedRevenue: revenue?.total ?? 0,
    });
  });
}
