# Zento

Zento is a planned production-ready, multilingual online store for digital technology. The project is currently at **Stage 0 — Analysis**; application code has not yet been scaffolded.

## Planned stack

- Next.js App Router, React, TypeScript
- Tailwind CSS
- Supabase PostgreSQL and Storage
- Drizzle ORM
- Auth.js, Zod
- Vitest, Playwright
- Vercel deployment

## Planned architecture

The application is a modular monolith. Next.js handles the user interface, server rendering, route handlers, server actions, authentication, and admin area. Services isolate product, order, user, and search logic. Drizzle provides typed access to Supabase PostgreSQL; images live in Supabase Storage.

Public routes will be locale-prefixed (`/ru`, `/en`, `/ro`) and include the home page, catalog, product pages, cart, checkout, and authentication. The protected administrative interface will live at `/admin` and is intentionally excluded from public navigation.

## Planned data model

The initial schema will include users, categories, brands, products, product images, product specifications, orders, and order items. Product images are referenced by storage path. Order item rows preserve product and price snapshots at the time of checkout.

## Setup (available after Stage 1)

1. Copy `.env.example` to `.env.local` and fill in Supabase and Auth.js variables.
2. Install dependencies.
3. Run database migrations and the demo seed.
4. Start the Next.js development server.

Exact commands, variable descriptions, database setup, testing, and deployment instructions will be added as the relevant stages are implemented.

## Project tracking

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the current implementation status and [CLAUDE.md](CLAUDE.md) for the project's engineering conventions.
