import type { Metadata } from "next";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = { title: "Book Now" };

export default async function BookPage() {
  const all = await db.select().from(services);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Book Now</h1>
      <p className="mt-3 text-muted">
        Reserve your slot in under a minute. A small downpayment may be
        required to confirm premium services.
      </p>
      <div className="mt-10 rounded-xl border border-border bg-panel p-6 md:p-8">
        <BookingForm services={all} />
      </div>
    </div>
  );
}
