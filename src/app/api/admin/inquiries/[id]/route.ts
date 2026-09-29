import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { inquiryStatusUpdateSchema } from "@/lib/validation";
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
    const { status } = inquiryStatusUpdateSchema.parse(body);

    const [updated] = await db
      .update(inquiries)
      .set({
        status,
        repliedAt: status === "REPLIED" ? new Date() : undefined,
      })
      .where(eq(inquiries.id, id))
      .returning();

    if (!updated) return jsonError("Inquiry not found.", 404);
    return jsonOk(updated);
  });
}
