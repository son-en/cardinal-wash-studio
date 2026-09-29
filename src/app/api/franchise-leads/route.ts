import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { franchiseLeads } from "@/lib/db/schema";
import { franchiseLeadSchema } from "@/lib/validation";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const key = clientKeyFromRequest(request, "leads:create");
    const { success } = rateLimit(key, { limit: 5, windowMs: 60_000 });
    if (!success) return jsonError("Too many requests. Please try again shortly.", 429);

    const body = await request.json();
    const data = franchiseLeadSchema.parse(body);

    const [created] = await db.insert(franchiseLeads).values(data).returning();

    return jsonOk(created, 201);
  });
}
