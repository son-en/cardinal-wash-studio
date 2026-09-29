import Link from "next/link";
import { db } from "@/lib/db";
import { services, galleryItems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const revalidate = 300;

export default async function HomePage() {
  const featuredServices = await db.select().from(services).limit(3);
  const featuredGallery = await db
    .select()
    .from(galleryItems)
    .orderBy(desc(galleryItems.featured))
    .limit(3);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-panel to-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24">
          <span className="rounded-full border border-accent/40 bg-accent-tint px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Taguig City · Est. School Project → Real Studio
          </span>
          <h1 className="max-w-2xl font-display text-5xl leading-tight text-white md:text-6xl">
            Showroom results,
            <br />
            every single visit.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Cardinal Wash Studio brings premium car care — wash, detailing,
            ceramic coating, and paint protection film — to drivers who expect
            more from a car wash.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/90"
            >
              Book an Appointment
            </Link>
            <Link
              href="/services"
              className="rounded-md border border-border px-6 py-3 font-semibold text-white transition hover:border-white"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-white">Popular Services</h2>
          <Link href="/services" className="text-sm font-medium text-accent hover:underline">
            See all services →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredServices.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-panel p-6 transition hover:border-accent/50"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-faint">
                {s.category}
              </span>
              <h3 className="mt-2 font-display text-2xl text-white">{s.name}</h3>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
              <p className="mt-4 font-display text-xl text-accent">
                ₱{s.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-panel-2 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-3xl text-white">Recent Transformations</h2>
            <Link href="/gallery" className="text-sm font-medium text-accent hover:underline">
              View full gallery →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredGallery.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-2">
                  <div className="flex h-32 items-center justify-center bg-panel text-xs uppercase tracking-wide text-faint">
                    Before
                  </div>
                  <div className="flex h-32 items-center justify-center bg-accent-tint text-xs uppercase tracking-wide text-accent">
                    After
                  </div>
                </div>
                <div className="bg-panel p-4">
                  <p className="font-medium text-white">{g.title}</p>
                  <p className="text-xs text-faint">{g.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-white">
          Thinking about opening your own Cardinal Wash Studio?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          We&rsquo;re expanding across the Philippines. Learn about our franchise
          models and submit your interest today.
        </p>
        <Link
          href="/franchise"
          className="mt-6 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/90"
        >
          Explore Franchise Us
        </Link>
      </section>
    </>
  );
}
