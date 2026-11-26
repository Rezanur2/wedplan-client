# WedPlan — Curated Wedding Planning Platform (Client)

**WedPlan** is a full-stack, role-based wedding planning platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **ShadCN UI**, **Framer Motion**, and **Better Auth**. Couples (Customers) can discover verified wedding services, filter by category and location, sort by price, and submit booking requests. Vendors can publish and manage services, handle booking requests, and upgrade to a Premium plan via **Stripe Checkout**. Admins oversee registered users, moderate service submissions, and monitor platform transactions.

---

## 🔗 Live & Repository Links

* **Live Website:** [https://wedplan-client-cyan.vercel.app](https://wedplan-client-cyan.vercel.app)
* **Live API Server:** [https://wedplan-server-orpin.vercel.app](https://wedplan-server-orpin.vercel.app)
* **Client Repository:** [https://github.com/Rezanur2/wedplan-client](https://github.com/Rezanur2/wedplan-client)
* **Server Repository:** [https://github.com/Rezanur2/wedplan-server](https://github.com/Rezanur2/wedplan-server)

---

## ✨ Important Features

### 1. Public Experience & Marketplace
* **Home Page:** Wedding-themed hero banner with search, dynamic **Featured Wedding Services** (approved & active listings), **6 Wedding Service Categories**, **Why Choose WedPlan?**, **How WedPlan Works**, and smooth **Framer Motion** animations.
* **Browse Services (`/services`):** Real-time keyword search, category filtering, location filtering, price sorting (Low to High & High to Low), responsive loading skeletons, and empty states.
* **Service Details (`/services/[id]`):** Protected route (redirects unauthenticated visitors to Sign In) with multi-image gallery, transparent pricing, vendor details, and role-aware booking card (prevents booking own services, admin/vendor bookings, paused/pending listings, and duplicate active dates).

### 2. Authentication & Role Security
* **Better Auth:** Email/password registration (with password strength rules) and **Google OAuth** login, plus **ImgBB** profile image upload on Sign Up and Profile Settings.
* **Role-Based Access Control:** Separate protected dashboards for Customer, Vendor, and Admin (`requireRole`), blocked-user enforcement, and JWT verification via JWKS on all private backend API calls.

### 3. Role-Based Dashboards
* **Customer Dashboard:** Booking statistics overview, detailed booking table/cards, pending booking cancellation, and profile settings.
* **Vendor Dashboard:** Studio overview, My Services (availability toggle, edit, delete, filter tabs), Add Service (multi-image ImgBB upload, 3-service Free tier limit), Booking Requests (accept/reject pending inquiries), Subscription upgrade via **Stripe Checkout**, and Profile Settings (syncs vendor details across existing listings).
* **Admin Dashboard:** Platform overview stats & recent service submissions, Manage Users (search, role filter, role update dropdown, block/unblock with immediate session invalidation), Manage Services (review modal, approve/reject/pause/delete, CSV export), and read-only Platform Transactions ledger.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling & UI:** Tailwind CSS v4, ShadCN UI (`@base-ui/react`), Lucide React
* **Animations:** Framer Motion (`framer-motion`)
* **Authentication:** Better Auth (`better-auth`, `@better-auth/mongo-adapter`) with JWT & Google OAuth
* **Backend & Payments:** Express.js 5 API + Stripe Checkout (verified via server-side Stripe Webhooks)
* **Image Hosting:** ImgBB API

---

## 📋 Environment Variables

Create a `.env` file in the root of `wedplan-client` (keep all sensitive keys out of version control):

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wedplandb

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB Image Hosting
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Express Backend API URL (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Rezanur2/wedplan-client.git
cd wedplan-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory using the variables listed above. Make sure the `wedplan-server` backend is also configured and running locally on port `5000`.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

* `npm run dev` — Starts the Next.js development server on port `3000`.
* `npm run build` — Creates an optimized production build.
* `npm run start` — Runs the production build locally.
* `npm run lint` — Runs ESLint checks across the codebase.
