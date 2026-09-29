import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// A single driver (libSQL) for both environments:
// - Local dev: DATABASE_URL="file:./data/dev.db" — an embedded, zero-config
//   SQLite file, no server needed.
// - Production (Vercel): DATABASE_URL="libsql://<db>.turso.io" plus
//   DATABASE_AUTH_TOKEN, pointing at a hosted Turso database.
//
// This project was originally scaffolded with Prisma, then better-sqlite3.
// Both were dropped in favor of libSQL: Vercel's serverless functions run on
// an ephemeral, largely read-only filesystem, so a plain local SQLite file
// (via better-sqlite3) would silently lose bookings between invocations in
// production. libSQL is the smallest change that keeps the same
// Drizzle/SQLite schema while giving production a real, persistent,
// network-backed database. See README "Deployment" for Turso setup.
const DATABASE_URL = process.env.DATABASE_URL || "file:./data/dev.db";
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

declare global {
  var __cws_libsql__: ReturnType<typeof createClient> | undefined;
}

const client =
  global.__cws_libsql__ ??
  createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

if (process.env.NODE_ENV !== "production") {
  global.__cws_libsql__ = client;
}

export const db = drizzle(client, { schema });
export { client };
