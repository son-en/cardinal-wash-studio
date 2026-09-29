import type { Metadata } from "next";
import { db } from "@/lib/db";
import { galleryItems } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Car Gallery" };
export const revalidate = 300;

export default async function GalleryPage() {
  const items = await db.select().from(galleryItems);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Car Gallery</h1>
      <p className="mt-3 max-w-xl text-muted">
        A look at real before-and-after transformations from the studio floor.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-2">
              <div className="flex h-40 flex-col items-center justify-center gap-1 bg-panel text-faint">
                <span className="text-xs font-semibold uppercase tracking-widest">Before</span>
              </div>
              <div className="flex h-40 flex-col items-center justify-center gap-1 bg-accent-tint text-accent">
                <span className="text-xs font-semibold uppercase tracking-widest">After</span>
              </div>
            </div>
            <div className="bg-panel p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{item.title}</p>
                {item.featured ? (
                  <span className="rounded-full bg-warning-tint px-2 py-0.5 text-xs font-semibold text-warning">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-faint">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
