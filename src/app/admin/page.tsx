import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, inquiries, franchiseLeads } from "@/lib/db/schema";
import { desc, eq, count, sql } from "drizzle-orm";
import AdminTopBar from "@/components/admin/AdminTopBar";
import StatCard from "@/components/admin/StatCard";
import BookingsTable from "@/components/admin/BookingsTable";
import InquiriesInbox from "@/components/admin/InquiriesInbox";
import FranchiseLeadsTable from "@/components/admin/FranchiseLeadsTable";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login?from=/admin");

  const [allBookings, allInquiries, allLeads, pendingBookings, newInquiries, newLeads, revenue] =
    await Promise.all([
      db.select().from(bookings).orderBy(desc(bookings.createdAt)),
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)),
      db.select().from(franchiseLeads).orderBy(desc(franchiseLeads.submittedAt)),
      db.select({ n: count() }).from(bookings).where(eq(bookings.status, "PENDING")),
      db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "NEW")),
      db.select({ n: count() }).from(franchiseLeads).where(eq(franchiseLeads.status, "NEW")),
      db
        .select({ total: sql<number>`coalesce(sum(${bookings.downpaymentAmount}), 0)` })
        .from(bookings),
    ]);

  return (
    <>
      <AdminTopBar name={user.name} />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 rounded-xl border border-accent/30 bg-accent-tint px-6 py-5">
          <h1 className="font-display text-3xl text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Manage bookings, customer inquiries, and franchise leads.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending Bookings" value={pendingBookings[0]?.n ?? 0} />
          <StatCard label="New Inquiries" value={newInquiries[0]?.n ?? 0} />
          <StatCard label="New Franchise Leads" value={newLeads[0]?.n ?? 0} />
          <StatCard
            label="Downpayments Collected"
            value={`₱${(revenue[0]?.total ?? 0).toLocaleString()}`}
          />
        </div>

        <section className="mb-10">
          <h2 className="mb-4 font-display text-2xl text-white">Bookings</h2>
          <BookingsTable initialBookings={allBookings} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-display text-2xl text-white">Inquiries</h2>
          <InquiriesInbox initialInquiries={allInquiries} />
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl text-white">Franchise Leads</h2>
          <FranchiseLeadsTable initialLeads={allLeads} />
        </section>
      </div>
    </>
  );
}
