import type { Metadata } from "next";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import Link from "next/link";

export const metadata: Metadata = { title: "Services & Add-Ons" };
export const revalidate = 300;

const categoryLabels: Record<string, string> = {
  WASH: "Wash Packages",
  DETAILING: "Detailing",
  PPF: "PPF & Ceramic Coating",
  ADDON: "Add-Ons",
};

export default async function ServicesPage() {
  const all = await db.select().from(services);
  const grouped = all.reduce<Record<string, typeof all>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Services & Add-Ons</h1>
      <p className="mt-3 max-w-xl text-muted">
        Choose the level of care your car deserves — from a quick express wash
        to full paint protection.
      </p>

      <div className="mt-12 space-y-12">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="font-display text-2xl text-accent">
              {categoryLabels[category] ?? category}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {items.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-panel p-5"
                >
                  <div>
                    <h3 className="font-medium text-white">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                  </div>
                  <p className="whitespace-nowrap font-display text-xl text-white">
                    ₱{s.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl border border-accent/30 bg-accent-tint p-8 text-center">
        <h2 className="font-display text-2xl text-white">Ready to book?</h2>
        <p className="mt-2 text-muted">Pick your service and reserve a slot in under a minute.</p>
        <Link
          href="/book"
          className="mt-4 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/90"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
