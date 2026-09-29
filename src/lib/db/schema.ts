// Cardinal Wash Studio — data model (Drizzle ORM, SQLite dialect)
//
// Dev/default: local SQLite file via better-sqlite3 (zero network deps —
// Prisma's engine binaries could not be fetched in this sandbox, so the
// project uses Drizzle instead).
// Production (Vercel): swap the driver in src/lib/db/index.ts for
// @libsql/client (Turso) or a Postgres driver (Neon/Supabase) and change
// the column builders below to the matching Drizzle dialect — the schema
// shape itself does not need to change. See README for details.

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

// ---------------------------------------------------------------------------
// Users (admin / staff)
// ---------------------------------------------------------------------------

export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["ADMIN", "STAFF"] })
    .notNull()
    .default("ADMIN"),
  createdAt: createdAt(),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
});

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export const bookings = sqliteTable("bookings", {
  id: id(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  vehicleSize: text("vehicle_size").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  serviceType: text("service_type").notNull(),
  requestedDatetime: integer("requested_datetime", {
    mode: "timestamp",
  }).notNull(),
  paymentStatus: text("payment_status", {
    enum: ["UNPAID", "PAID_DOWNPAYMENT", "PAID", "REFUNDED"],
  })
    .notNull()
    .default("UNPAID"),
  status: text("status", {
    enum: ["PENDING", "CONFIRMED", "IN_SERVICE", "COMPLETED", "CANCELLED"],
  })
    .notNull()
    .default("PENDING"),
  downpaymentAmount: integer("downpayment_amount").notNull().default(0),
  notes: text("notes"),
  createdAt: createdAt(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------

export const inquiries = sqliteTable("inquiries", {
  id: id(),
  customerName: text("customer_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  channel: text("channel", {
    enum: ["WEBSITE", "FACEBOOK", "INSTAGRAM", "PHONE"],
  })
    .notNull()
    .default("WEBSITE"),
  message: text("message").notNull(),
  status: text("status", { enum: ["NEW", "REPLIED", "RESOLVED"] })
    .notNull()
    .default("NEW"),
  createdAt: createdAt(),
  repliedAt: integer("replied_at", { mode: "timestamp" }),
});

// ---------------------------------------------------------------------------
// Franchise leads
// ---------------------------------------------------------------------------

export const franchiseLeads = sqliteTable("franchise_leads", {
  id: id(),
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull(),
  preferredCity: text("preferred_city").notNull(),
  modelInterest: text("model_interest", {
    enum: ["FULL_STUDIO", "EXPRESS_BAY"],
  })
    .notNull()
    .default("FULL_STUDIO"),
  status: text("status", {
    enum: ["NEW", "CONTACTED", "QUALIFIED", "DECLINED"],
  })
    .notNull()
    .default("NEW"),
  submittedAt: createdAt(),
});

// ---------------------------------------------------------------------------
// Services (wash / PPF / add-ons / detailing)
// ---------------------------------------------------------------------------

export const services = sqliteTable("services", {
  id: id(),
  name: text("name").notNull(),
  tier: integer("tier").notNull().default(1),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: ["WASH", "PPF", "ADDON", "DETAILING"],
  }).notNull(),
});

// ---------------------------------------------------------------------------
// Products (store)
// ---------------------------------------------------------------------------

export const products = sqliteTable("products", {
  id: id(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  imageUrl: text("image_url"),
});

// ---------------------------------------------------------------------------
// Orders (store checkout)
// ---------------------------------------------------------------------------

export const orders = sqliteTable("orders", {
  id: id(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  items: text("items", { mode: "json" }).notNull().$type<
    { productId: string; name: string; price: number; qty: number }[]
  >(),
  total: integer("total").notNull(),
  status: text("status", {
    enum: ["PENDING", "PAID", "FULFILLED", "CANCELLED"],
  })
    .notNull()
    .default("PENDING"),
  createdAt: createdAt(),
});

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export const galleryItems = sqliteTable("gallery_items", {
  id: id(),
  title: text("title").notNull(),
  beforeImageUrl: text("before_image_url").notNull(),
  afterImageUrl: text("after_image_url").notNull(),
  category: text("category").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type FranchiseLead = typeof franchiseLeads.$inferSelect;
export type NewFranchiseLead = typeof franchiseLeads.$inferInsert;
export type Service = typeof services.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
