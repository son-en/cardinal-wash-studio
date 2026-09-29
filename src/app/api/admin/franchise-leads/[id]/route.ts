import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { franchiseLeads } from "@/lib/db/schema";
import { franchiseLeadStatusUpdateSchema } from "@/lib/validation";
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
    const { status } = franchiseLeadStatusUpdateSchema.parse(body);

    const [updated] = await db
      .update(franchiseLeads)
      .set({ status })
      .where(eq(franchiseLeads.id, id))
      .returning();

    if (!updated) return jsonError("Lead not found.", 404);
    return jsonOk(updated);
  });
}
