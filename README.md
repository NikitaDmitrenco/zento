# Zento — Modern Digital Electronics E-Commerce Platform

> **Primary Goal:** Help customers quickly, easily, and accurately find the right electronics based on their personal query and place an order in just a few clicks.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://zento-blue.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live_Demo-zento--blue.vercel.app-blue?logo=googlechrome)](https://zento-blue.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=postgresql)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-34_Passed-6E9F18?logo=vitest)](https://vitest.dev/)
[![DeepSeek AI](https://img.shields.io/badge/AI_Assistant-DeepSeek-blueviolet)](https://platform.deepseek.com/)

---

## 🌐 Live Demo & Testing

The project is fully built, deployed to **Vercel**, and connected to a **Supabase PostgreSQL** cloud database:

* 🛒 **Storefront (Production):** [https://zento-blue.vercel.app](https://zento-blue.vercel.app)
  * 🇬🇧 English: [https://zento-blue.vercel.app/en](https://zento-blue.vercel.app/en)
  * 🇷🇺 Russian: [https://zento-blue.vercel.app/ru](https://zento-blue.vercel.app/ru)
  * 🇲🇩 Romanian: [https://zento-blue.vercel.app/ro](https://zento-blue.vercel.app/ro)
* ⚙️ **Admin Panel:** [https://zento-blue.vercel.app/admin](https://zento-blue.vercel.app/admin)

### 🔑 Test Credentials:

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Administrator** | `admin@zento.tech` | `admin123` | Access to `/admin` backoffice, product management, order tracking, user list |
| **👤 Customer** | `user@zento.tech` | `user123` | Product search, shopping cart, checkout process, AI Assistant consultation |

---

## 🚀 Core Features

### 1. Storefront (Customer Experience)
- 🔍 **Smart Search & Filtering**: Instant search across titles, descriptions, and top brands (**Apple, Samsung, Xiaomi, Sony, ASUS, Google, Lenovo, Bose, Garmin, Anker**). Category, price, and in-stock filters without page reloads.
- 📱 **Catalog & Product Pages**: Full-bleed studio photos on clean backgrounds, comprehensive technical specification matrices, and featured badges.
- 🛒 **Cart & Calculation**: Instant add-to-cart, dynamic item count, and price recalculations.
- 💳 **Checkout & Payments**:
  - Payment options: *«Cash/Card on Delivery (Courier)»* or *«Online Bank Card Payment»*.
  - Interactive virtual credit card with number, expiry, CVC validation, and 3D-Secure 2.0 simulation.
  - Success confirmation screen with order tracking ID and status.
- 🌐 **Tri-Lingual Localization**: Route-level internationalization for 3 languages (**EN / RU / RO**) across `/en`, `/ru`, and `/ro` with zero runtime overhead.
- 🔐 **Authentication & Profiles**: Secure sign-in and registration with stateless JWT stored in `httpOnly` cookies and bcrypt password hashing.

### 2. Admin Backoffice (`/admin`)
- 📊 **Metrics Dashboard**: Overview of active products, received orders, and registered customers.
- 📦 **Order Management**: Real-time order monitoring with statuses: `Pending` → `Paid/Confirmed` → `Processing` → `Shipped` → `Completed`.
- ➕ **Product Creation**: Add new products with automatic URL slug generation, brand/category assignment, and dynamic specification tables.
- 👥 **User Management**: Overview of registered accounts and role assignments (`USER` / `ADMIN`).
- 🛡️ **Edge Middleware Protection**: Route-level access restriction to `/admin` enforced at the CDN edge for unauthenticated users.

### 3. Built-in AI Shopping Assistant
- ✨ **Smart Consultant (Bottom-Right Widget)**:
  - Powered by the **DeepSeek** LLM (`deepseek-chat`).
  - Comprehensive knowledge of the entire store catalog, exact specs, and prices in MDL.
  - Recommends devices based on customer budgets and needs (*«Recommend a lightweight laptop for work»*, *«Best noise-cancelling headphones»*).
  - Renders **interactive product recommendation cards** with photos, prices, and direct product links inside the chat.
  - Politely and clearly explains store policies (online-only courier delivery model, absence of physical showroom).
  - Operates fluently in English, Russian, and Romanian with an offline fallback mode.

---

## 🛠️ Tech Stack & Architecture

Engineered following the **Modular Monolith** architecture with a focus on speed, scalability, and strict financial security:

```
┌─────────────────────────────────────────────────────────────┐
│                    ZENTO ARCHITECTURE                       │
├──────────────────────────────┬──────────────────────────────┤
│ Frontend & Rendering         │ Next.js 16 App Router,       │
│                              │ React 19, Turbopack, SSR     │
├──────────────────────────────┼──────────────────────────────┤
│ Styling & Design System      │ Tailwind CSS v4,             │
│                              │ Modern Clean UI              │
├──────────────────────────────┼──────────────────────────────┤
│ Language & Typing            │ TypeScript (100% Strict)     │
├──────────────────────────────┼──────────────────────────────┤
│ Database & ORM               │ PostgreSQL (Supabase Cloud), │
│                              │ Drizzle ORM                  │
├──────────────────────────────┼──────────────────────────────┤
│ Artificial Intelligence      │ DeepSeek API + Smart Logic   │
├──────────────────────────────┼──────────────────────────────┤
│ Auth & Security              │ Stateless JWT (jose HS256),  │
│                              │ bcryptjs, Edge Middleware    │
├──────────────────────────────┼──────────────────────────────┤
│ Quality & Testing            │ Vitest (34 tests), ESLint,   │
│                              │ Playwright E2E               │
└──────────────────────────────┴──────────────────────────────┘
```

* **Financial Integrity**: All financial calculations (prices, discounts, order totals) are stored and calculated on the server in minor integer units (cents/bani), eliminating floating-point rounding errors and client-side price tampering.
* **Serverless Ready**: Architecture is optimized for instant scalability on Vercel, AWS, or self-hosted VPS servers (Docker / Ubuntu).

---

## 💻 How to Clone and Run Locally

You can deploy and test the project locally using the command line (CMD / PowerShell / Terminal).

### Step 1. Clone the repository from GitHub
```bash
git clone https://github.com/NikitaDmitrenco/zento.git
cd zento
```

### Step 2. Install dependencies
```bash
npm install
```

### Step 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
# Database connection string (Supabase PostgreSQL or local Postgres)
DATABASE_URL="postgresql://postgres.syvocricidabqykwdngh:L3sufTEPM6yRHcyn@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Secret key for stateless JWT authentication (any random string >= 32 chars)
AUTH_SECRET="supersecret_production_auth_key_zento_2024_secure"
AUTH_URL="http://localhost:3000"

# DeepSeek API Key (optional, offline fallback mode is built-in)
DEEPSEEK_API_KEY=""
```

### Step 4. Seed the database with products
```bash
# Push table schema to database
npm run db:push

# Seed database with categories, brands, and 20 real tech products
npm run db:seed
```

### Step 5. Start the development server
```bash
npm run dev
```

Open in your browser: **[http://localhost:3000/en](http://localhost:3000/en)**

---

## 🧪 Running Automated Tests

The project includes a comprehensive automated test suite covering database queries, search indexing, shopping cart, checkout, auth, and the AI Assistant:

```bash
# Run all 34 automated unit & integration tests (Vitest)
npm run test

# Validate strict TypeScript types
npm run typecheck

# Check code quality with ESLint
npm run lint

# Build optimized production bundle
npm run build
```

---

## 📁 Project Structure

```
zento/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Localized storefront pages (/, /catalog, /product, /cart, /checkout)
│   │   ├── admin/                # Protected admin backoffice (/admin/orders, /admin/products, /admin/users)
│   │   └── api/                  # Server Route Handlers (/api/ai/chat, /api/auth/*, /api/orders/*)
│   ├── components/               # Modular React UI Components
│   │   ├── ai/                   # Interactive AI Assistant Widget
│   │   ├── catalog/              # Product cards, catalog filters, search bar
│   │   ├── checkout/             # Checkout form with virtual bank card
│   │   └── ui/                   # Primitive UI components (buttons, inputs, badges, icons)
│   ├── db/                       # Database Layer
│   │   ├── schema.ts             # Drizzle PostgreSQL Schema
│   │   ├── seed.ts               # Database Seeding Script
│   │   └── data/                 # Real catalog data: products, categories, brands
│   ├── i18n/                     # Internationalization (dictionaries: en.json, ru.json, ro.json)
│   ├── lib/                      # Auth utilities (JWT, sessions, cookies)
│   ├── services/                 # Domain Business Services (AI, catalog, orders, cart, auth)
│   └── middleware.ts             # Edge Middleware for admin route protection
├── tests/                        # 34 Unit and Integration Tests (Vitest)
├── public/                       # Static assets, brand logos, product photos
├── README.md                     # Project Documentation
└── package.json                  # Dependencies and npm scripts
```

---

### 👨‍💻 Project Author
**Nikita Dmitrenco**  
GitHub: [@NikitaDmitrenco](https://github.com/NikitaDmitrenco)  
Repository: [https://github.com/NikitaDmitrenco/zento](https://github.com/NikitaDmitrenco/zento)
