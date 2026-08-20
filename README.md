# Zento — E-Commerce Web Application

Zento is a full-stack e-commerce application with products, user accounts, cart, orders and an admin panel.

[Live Demo](https://zento-blue.vercel.app) · [GitHub](https://github.com/NikitaDmitrenco/zento)

---

## Features

- **Product catalogue** with search and category filters
- **User registration and login** with password hashing and session cookies
- **Shopping cart** with dynamic quantity updates
- **Order checkout flow** with server-side price validation
- **Admin panel** for managing products and viewing orders
- **PostgreSQL database** with Drizzle ORM
- **Multi-language support** (English, Russian, Romanian)
- **AI Shopping Assistant** embedded chat widget powered by DeepSeek API (with offline catalog fallback)
- **Responsive interface** built with React and Tailwind CSS

---

## How It Works

```text
Browser
  ↓
Next.js
  ↓
Server-side logic
  ↓
Database
```

The browser handles the user interface. Next.js handles the application routing and page rendering. Server-side code validates requests and handles business logic. PostgreSQL (Supabase) stores users, products, carts, and orders.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Node.js, Next.js Route Handlers, Zod
- **Database**: PostgreSQL (Supabase), Drizzle ORM
- **Authentication**: Stateless JWT sessions (`jose`), `bcryptjs`, `httpOnly` cookies
- **AI Assistant**: DeepSeek API with offline fallback
- **Testing**: Vitest (34 tests)

---

## Testing

The project includes **34 automated tests** (Vitest) covering auth, cart, catalog, orders, and database operations:

```bash
# Run automated tests
npm run test

# Type check
npm run typecheck
```

---

## Local Development

### 1. Clone & Install
```bash
git clone https://github.com/NikitaDmitrenco/zento.git
cd zento
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
# Database connection string
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:6543/postgres"

# Secret key for JWT session signing (at least 32 characters)
AUTH_SECRET="your-secure-random-secret-key-at-least-32-chars"
AUTH_URL="http://localhost:3000"

# DeepSeek API Key (optional; offline fallback is included)
DEEPSEEK_API_KEY=""
```

### 3. Push Schema & Seed
```bash
npm run db:push
npm run db:seed
```

### 4. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

---

## Limitations

This is a portfolio/MVP project. For a full production deployment, the following areas would need additional work:
- Production payment provider integration (e.g., Stripe)
- Application monitoring and error tracking (e.g., Sentry)
- API rate limiting and security hardening
- Expanded End-to-End browser testing


