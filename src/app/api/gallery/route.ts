import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";
import { jsonOk, withErrorHandling } from "@/lib/api-helpers";

export const revalidate = 300;

export async function GET() {
  return withErrorHandling(async () => {
    const all = await db.select().from(galleryItems);
    return jsonOk(all);
  });
}
