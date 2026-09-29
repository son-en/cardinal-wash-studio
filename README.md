# Cardinal Wash Studio

A full-stack website for Cardinal Wash Studio (car wash / detailing), built with Next.js 16, matching the Figma design system exactly: dark theme, crimson accent, Bebas Neue display type.

**Pages:** Home · Services & Add-Ons · Book Now · Car Gallery · Store · Franchise Us · Admin Login · Admin Dashboard

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- **Fonts:** Bebas Neue + Inter, self-hosted via `@fontsource` (no runtime dependency on Google Fonts)
- **Database:** Drizzle ORM on libSQL — a local file in dev, [Turso](https://turso.tech) in production
- **Auth:** bcrypt password hashing + JWT session cookies (`jose`), route protection via `src/proxy.ts` (Next 16's renamed `middleware.ts`)
- **Validation:** Zod on every API route
- **Security:** rate limiting, security headers/CSP (`next.config.ts`), parameterized queries throughout, no secrets in code

## Local Setup

```bash
npm install
cp .env.example .env   # if you don't already have a .env — see below
npm run db:generate     # generate SQL migrations from the schema (already committed under /drizzle)
npm run db:migrate      # create/update the local database
npm run db:seed         # seed sample services, products, gallery, bookings, inquiries, leads + an admin user
npm run dev
```

Open http://localhost:3000. The admin dashboard is at `/admin` (redirects to `/admin/login`).

**Seeded admin login:** `admin@cardinalwash.studio` / `CardinalAdmin!2026` (or whatever `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` you set before seeding). **Change this password before going live.**

### Environment variables

| Variable | Local dev | Production |
|---|---|---|
| `DATABASE_URL` | `file:./data/dev.db` | `libsql://<your-db>.turso.io` |
| `DATABASE_AUTH_TOKEN` | not needed | your Turso auth token |
| `SESSION_SECRET` | any string | a long random secret (`openssl rand -base64 32`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | optional, used only by `npm run db:seed` | — |

## Deployment (Vercel + Turso)

Vercel's serverless functions run on an ephemeral, largely read-only filesystem — a plain local SQLite file would silently lose bookings between invocations. This project uses **libSQL** for that reason: the same Drizzle schema and query code work against a local file in dev and a hosted [Turso](https://turso.tech) database in production, so there's no rewrite needed to go live.

1. **Push this project to a GitHub repository** (see below if it isn't already there).
2. **Create a free Turso database:**
   ```bash
   npx @turso/cli auth login
   npx @turso/cli db create cardinal-wash-studio
   npx @turso/cli db show cardinal-wash-studio --url      # → DATABASE_URL
   npx @turso/cli db tokens create cardinal-wash-studio    # → DATABASE_AUTH_TOKEN
   ```
   (Or create one at [turso.tech](https://turso.tech) — no card required on the free tier.)
3. **Run migrations against Turso** from your machine, pointing at the new database:
   ```bash
   DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:migrate
   DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:seed
   ```
4. **Import the repo into Vercel:** [vercel.com/new](https://vercel.com/new) → select the GitHub repo → Vercel auto-detects Next.js, no build config needed.
5. **Add environment variables** in the Vercel project settings (Settings → Environment Variables): `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `SESSION_SECRET`.
6. **Deploy.** Every push to the main branch redeploys automatically.

### Going further

- Change the seeded admin password immediately after your first deploy.
- The build prompt doc (delivered earlier) lists suggested connectors (Twilio for SMS confirmations, Cloudinary/S3 for real gallery photos, a payment gateway for online downpayments, etc.) — none of those are wired up yet; the current flow is intentionally manual/no-live-payment, matching what was scoped.
- `src/lib/rate-limit.ts` is in-memory and fine for a single-region small-business site; swap for Upstash Redis if you scale to multiple regions.

## Project structure

```
src/
  app/
    (site)/          # public pages — share Nav/Footer via layout.tsx
    admin/            # admin login + dashboard — no public nav/footer
    api/              # route handlers (public + /api/admin/*)
  components/         # shared UI (public + admin/)
  lib/
    db/               # Drizzle schema + client
    auth.ts           # password hashing, JWT sessions
    validation.ts     # zod schemas
    rate-limit.ts
  proxy.ts            # route protection for /admin and /api/admin (Next 16's middleware)
scripts/
  migrate.ts
  seed.ts
drizzle/              # generated SQL migrations
```
