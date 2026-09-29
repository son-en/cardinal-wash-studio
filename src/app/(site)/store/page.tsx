import type { Metadata } from "next";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import StoreCart from "@/components/StoreCart";

export const metadata: Metadata = { title: "Store" };

export default async function StorePage() {
  const all = await db.select().from(products);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Store</h1>
      <p className="mt-3 max-w-xl text-muted">
        Take the Cardinal Wash Studio care routine home with you.
      </p>
      <div className="mt-10">
        <StoreCart products={all} />
      </div>
    </div>
  );
}
