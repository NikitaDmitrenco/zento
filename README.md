# Zento — Full-Stack E-Commerce Application

Zento is a full-stack e-commerce web application featuring a localized electronics catalog, shopping cart, server-authoritative checkout, customer authentication, order management, an admin dashboard, and an integrated AI shopping assistant.

---

## 🌐 Live Demo & Testing

The application is deployed on **Vercel** and backed by a **Supabase PostgreSQL** database:

* 🛒 **Storefront Demo:** [https://zento-blue.vercel.app](https://zento-blue.vercel.app)
  * English: [https://zento-blue.vercel.app/en](https://zento-blue.vercel.app/en)
  * Russian: [https://zento-blue.vercel.app/ru](https://zento-blue.vercel.app/ru)
  * Romanian: [https://zento-blue.vercel.app/ro](https://zento-blue.vercel.app/ro)
* ⚙️ **Admin Panel:** [https://zento-blue.vercel.app/admin](https://zento-blue.vercel.app/admin)
* 📦 **Source Code:** [https://github.com/NikitaDmitrenco/zento](https://github.com/NikitaDmitrenco/zento)

### 🔑 Test Credentials:

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@zento.tech` | `admin123` | Access to `/admin` dashboard, product creation, order tracking, customer list |
| **Customer** | `user@zento.tech` | `user123` | Product browsing, shopping cart, checkout flow, AI shopping assistant |

---

## 🎯 What it demonstrates

This project demonstrates the ability to build and deploy a complete full-stack web application:

- **Product Catalogue**: Multi-category filtering, text search across titles and specifications, brand filters, and localized product details.
- **User Accounts & Authentication**: Registration and login with password hashing (`bcryptjs`), stateless JWT sessions in `httpOnly` cookies, and session verification.
- **Shopping Cart**: Client-side state management with dynamic item counting and price updates.
- **Server-Authoritative Checkout**: Server-side price recalculation using integer minor units (cents) to prevent client-side price tampering.
- **Order Management**: Order persistence in PostgreSQL with tracking statuses (`Pending`, `Paid`, `Processing`, `Shipped`, `Completed`).
- **Admin Interface**: Protected backoffice routes for creating products with dynamic specifications and monitoring customer orders.
- **AI Shopping Assistant**: Embedded chat assistant powered by DeepSeek API that answers catalog questions, recommends products with cards, and includes an offline fallback mode.
- **Multi-Language Support (i18n)**: Sub-path localization (`/en`, `/ru`, `/ro`) with typed dictionary files.
- **Defensive Validation**: Form and API payload validation using Zod schemas.

---

## 🏗️ How it works

### System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (CLIENT)                         │
│  React 19 UI · Tailwind CSS v4 · Cart State · i18n Router   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               NEXT.JS APPLICATION LAYER                     │
│  App Router · Server Components · Route Handlers (/api/*)   │
│  Edge Middleware (/admin route protection)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              BUSINESS LOGIC & DOMAIN SERVICES               │
│  Auth (JWT/bcrypt) · Order Processing · Minor-Unit Pricing  │
│  DeepSeek AI Integration · Zod Schema Validation            │
└──────────────────────────────┬──────────────────────────────┘
                               │ Drizzle ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 POSTGRESQL DATABASE                         │
│  Supabase Cloud: Products, Categories, Orders, Users        │
└─────────────────────────────────────────────────────────────┘
```

### Layer Explanation:
1. **Frontend**: React 19 client components styled with Tailwind CSS v4, handling user interactions, localized interfaces, and form state.
2. **Application Layer**: Next.js App Router managing server-rendered pages, API Route Handlers (`/api/auth/*`, `/api/orders/*`, `/api/ai/*`), and Edge Middleware for route protection.
3. **Domain Services**: Server-side service modules that validate inputs with Zod, compute order totals from database prices, and sign JWT auth tokens.
4. **Database Layer**: PostgreSQL hosted on Supabase, accessed via Drizzle ORM with schema migrations and seed scripts.

---

## 🔄 Main flows

### 1. Authentication Flow
```text
User fills login/register form
  ↓
POST /api/auth/login or POST /api/auth/register
  ↓
Server validates input with Zod → queries user in PostgreSQL
  ↓
Verifies password with bcryptjs (or hashes on register)
  ↓
Generates signed JWT token via jose → sets in httpOnly secure cookie
  ↓
Next.js Middleware validates session cookie when accessing /admin
```

### 2. Product Browsing Flow
```text
User navigates to /[locale]/catalog or /[locale]/product/[slug]
  ↓
Next.js Server Component queries PostgreSQL via Drizzle ORM
  ↓
Fetches categories, brands, specifications, and localized strings
  ↓
Renders responsive product cards and specification matrices
  ↓
Client-side filters allow instant category & price refinement
```

### 3. Cart & Server-Authoritative Checkout Flow
```text
User adds items to cart → client manages cart items
  ↓
User proceeds to Checkout and submits shipping & payment choice
  ↓
POST /api/orders/create with cart item IDs and quantities
  ↓
Server queries database for current prices (never trusts client price totals)
  ↓
Server computes order sum using integer minor units (cents)
  ↓
Inserts order record and order_items rows into PostgreSQL
  ↓
Returns order ID → redirects to success confirmation page
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend & APIs**: Node.js, Next.js Route Handlers, Zod Validation
- **Database & ORM**: PostgreSQL (Supabase), Drizzle ORM, Drizzle Kit
- **Authentication**: Stateless JWT (`jose`), `bcryptjs`, `httpOnly` cookies, Next.js Middleware
- **AI Assistant**: DeepSeek API (`deepseek-chat`) + offline catalog fallback service
- **Testing & Quality**: Vitest (34 automated tests), Playwright, ESLint, TypeScript Strict Mode

---

## 🧪 Testing

The repository includes **34 automated unit and integration tests** executed with Vitest across 11 test suites:

- **Auth**: Token creation, verification, signature tampering detection, password hashing.
- **Cart**: Price calculation, item addition, quantity updates, total formatting.
- **Catalog**: Search filtering, category queries, price range logic.
- **Orders**: Order creation, server price verification, validation checks.
- **AI Service**: Prompt generation, catalog knowledge fallback, response structuring.
- **i18n**: Dictionary key parity across English, Russian, and Romanian.

```bash
# Run all 34 Vitest tests
npm run test

# Run TypeScript type check
npm run typecheck

# Run ESLint check
npm run lint
```

---

## 📁 Project Structure

```text
zento/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Localized storefront (catalog, product, cart, checkout)
│   │   ├── admin/                # Protected admin backoffice (orders, products, users)
│   │   └── api/                  # API Route Handlers (auth, orders, ai)
│   ├── components/               # React UI components
│   │   ├── ai/                   # AI shopping assistant widget
│   │   ├── catalog/              # Product cards, catalog filters, search
│   │   ├── checkout/             # Checkout form and payment selection
│   │   └── ui/                   # Primitive UI components (buttons, inputs, cards)
│   ├── db/                       # Database schema and seed data
│   │   ├── schema.ts             # Drizzle PostgreSQL schema definitions
│   │   ├── seed.ts               # Database seed runner
│   │   └── data/                 # Demo products, categories, and brand data
│   ├── i18n/                     # Localization configuration and JSON dictionaries
│   ├── lib/                      # Auth and session helper utilities
│   ├── services/                 # Domain business services (auth, cart, orders, search, ai)
│   └── middleware.ts             # Route protection middleware
├── tests/                        # 34 Vitest unit and integration tests
├── public/                       # Static assets and images
└── package.json
```

---

## 💻 Local Development

### 1. Clone & Install
```bash
git clone https://github.com/NikitaDmitrenco/zento.git
cd zento
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Supabase / PostgreSQL database connection string
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:6543/postgres"

# Secret key for JWT session signing (at least 32 random characters)
AUTH_SECRET="your-secure-random-secret-key-at-least-32-chars"
AUTH_URL="http://localhost:3000"

# Optional: DeepSeek API key for live AI assistant (offline fallback is built-in)
DEEPSEEK_API_KEY=""
```

### 3. Push Schema & Seed Data
```bash
# Push table schema to your PostgreSQL database
npm run db:push

# Seed database with initial categories, brands, and products
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

---

## 🔍 Limitations & What I Would Improve Next

This project is a functional e-commerce application and portfolio project. For a high-traffic production deployment, the following areas would be the next focus:

- **Production Payment Gateway**: Integrating live payment providers (such as Stripe or local banking APIs) with webhook signature verification.
- **Monitoring & Observability**: Adding structured logging and error reporting (e.g., Sentry) to track runtime errors and checkout failures.
- **Rate Limiting**: Implementing rate limits on sensitive endpoints (`/api/auth/*`, `/api/ai/*`) to prevent abuse.
- **Expanded E2E Testing**: Expanding automated browser testing suites with Playwright across full checkout flows in CI/CD.
- **Media Asset Storage**: Moving local static product images to dedicated cloud object storage (e.g. Supabase Storage / S3) with an image CDN.

