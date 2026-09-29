import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { bookingStatusUpdateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/require-admin";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    const { user, error } = await requireAdmin();
    if (!user) return jsonError(error!, 401);

    const { id } = await params;
    const body = await request.json();
    const data = bookingStatusUpdateSchema.parse(body);

    if (!data.status && !data.paymentStatus) {
      return jsonError("Provide at least one of status or paymentStatus.", 400);
    }

    const [updated] = await db
      .update(bookings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();

    if (!updated) return jsonError("Booking not found.", 404);
    return jsonOk(updated);
  });
}
