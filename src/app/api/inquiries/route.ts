import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { inquirySchema } from "@/lib/validation";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const key = clientKeyFromRequest(request, "inquiries:create");
    const { success } = rateLimit(key, { limit: 8, windowMs: 60_000 });
    if (!success) return jsonError("Too many requests. Please try again shortly.", 429);

    const body = await request.json();
    const data = inquirySchema.parse(body);

    const [created] = await db
      .insert(inquiries)
      .values({
        customerName: data.customerName,
        email: data.email || null,
        phone: data.phone || null,
        channel: data.channel,
        message: data.message,
      })
      .returning();

    return jsonOk(created, 201);
  });
}
