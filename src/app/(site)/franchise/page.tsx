import type { Metadata } from "next";
import FranchiseForm from "@/components/FranchiseForm";

export const metadata: Metadata = { title: "Franchise Us" };

const models = [
  {
    name: "Full Studio",
    blurb: "Complete wash, detailing, PPF and ceramic coating bays with a retail store.",
    investment: "₱3.5M – ₱6M",
  },
  {
    name: "Express Bay",
    blurb: "Compact express-wash format for malls, gas stations, and high-traffic corners.",
    investment: "₱1.2M – ₱2M",
  },
];

export default function FranchisePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Franchise Us</h1>
      <p className="mt-3 max-w-xl text-muted">
        Bring the Cardinal Wash Studio experience to your city. Two proven
        formats, one trusted brand.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {models.map((m) => (
          <div key={m.name} className="rounded-xl border border-border bg-panel p-6">
            <h2 className="font-display text-2xl text-accent">{m.name}</h2>
            <p className="mt-2 text-sm text-muted">{m.blurb}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-faint">
              Estimated Investment
            </p>
            <p className="mt-1 font-display text-xl text-white">{m.investment}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-white">Submit Your Interest</h2>
          <p className="mt-2 text-muted">
            Fill out the form and our franchise development team will follow
            up with a detailed information pack.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-panel p-6 md:p-8">
          <FranchiseForm />
        </div>
      </div>
    </div>
  );
}
