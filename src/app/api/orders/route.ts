import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";
import { orderSchema } from "@/lib/validation";
import { jsonError, jsonOk, withErrorHandling } from "@/lib/api-helpers";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import { inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const key = clientKeyFromRequest(request, "orders:create");
    const { success } = rateLimit(key, { limit: 5, windowMs: 60_000 });
    if (!success) return jsonError("Too many requests. Please try again shortly.", 429);

    const body = await request.json();
    const data = orderSchema.parse(body);

    // Re-price server-side from the DB rather than trusting client-sent prices.
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));
    const priceById = new Map(dbProducts.map((p) => [p.id, p.price]));

    let total = 0;
    const verifiedItems = data.items.map((item) => {
      const price = priceById.get(item.productId);
      if (price === undefined) {
        throw new Error(`Unknown product: ${item.productId}`);
      }
      total += price * item.qty;
      return { productId: item.productId, name: item.name, price, qty: item.qty };
    });

    const [created] = await db
      .insert(orders)
      .values({
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        items: verifiedItems,
        total,
      })
      .returning();

    return jsonOk(created, 201);
  });
}
