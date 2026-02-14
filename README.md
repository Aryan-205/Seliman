# Restaurant SaaS Platform

High-performance Restaurant SaaS built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, and **Prisma**.

## Tech Stack

- **UI:** shadcn-style components (CVA), Lucide React, Framer Motion
- **State:** Zustand (cart, menu)
- **Validation:** Zod + React Hook Form (ready for forms)
- **Backend:** Next.js Server Actions + Prisma (PostgreSQL)
- **Auth:** Next-Auth (Auth.js) v5 with role-based access (ADMIN, USER)

## Project Structure

```
/app
  /(customer)     # Public: landing, menu, cart, booking, location
  /(admin)        # Protected: orders, menu CRUD, QR
  /login           # Admin sign-in
  /api/auth/[...nextauth]
/components
  /shared          # Reusable UI and layout components
  /ui              # Base UI (Button, Input, Card)
/store             # Zustand: useCartStore, useMenuStore
/lib               # Prisma client, Zod schemas, utils
  /schemas         # order.ts, menu-item.ts
/prisma            # schema.prisma
```

## Getting Started

1. **Install dependencies**

   ```bash
   cd restaurant-saas && npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string
   - `AUTH_SECRET` – e.g. `openssl rand -base64 32`

3. **Database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed admin user (optional)**

   Create an ADMIN user with a hashed password in Prisma Studio or a one-off script using `bcryptjs.hash("your-password", 10)` and insert into `User` with `role: "ADMIN"`.

5. **Run dev server**

   ```bash
   npm run dev
   ```

- **Customer:** http://localhost:3000 (landing, menu, cart, booking, location)
- **Table QR:** http://localhost:3000/table/5 (sets table number, then menu)
- **Admin:** http://localhost:3000/admin (requires ADMIN login)
- **Login:** http://localhost:3000/login

## Features

- **Customer:** Landing (Bento grid), digital menu by category, Add to Cart, `/table/[id]` for QR table number, cart with “Send Order” (Server Action → admin feed).
- **Admin:** Live order feed (polling), menu CRUD, QR table link generator.
- **Auth:** Credentials provider; admin layout checks `session.user.role === "ADMIN"`.

## Menu without DB

If `DATABASE_URL` is missing or Prisma fails, the app uses **mock menu data** from `lib/mock-menu.ts`. Orders and admin auth require a working database.
# Seliman
