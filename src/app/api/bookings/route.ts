import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { bookingSchema } from "@/lib/validation";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const key = clientKeyFromRequest(request, "bookings:create");
    const { success } = rateLimit(key, { limit: 5, windowMs: 60_000 });
    if (!success) return jsonError("Too many requests. Please try again shortly.", 429);

    const body = await request.json();
    const data = bookingSchema.parse(body);

    const [created] = await db
      .insert(bookings)
      .values({
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        vehicleSize: data.vehicleSize,
        vehicleModel: data.vehicleModel,
        serviceType: data.serviceType,
        requestedDatetime: data.requestedDatetime,
        notes: data.notes || null,
      })
      .returning();

    return jsonOk(created, 201);
  });
}
