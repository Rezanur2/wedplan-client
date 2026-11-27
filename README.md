# WedPlan — Wedding Planning Platform (Client)

**WedPlan** is a full-stack, role-based wedding planning platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **ShadCN UI**, **Framer Motion**, and **Better Auth**. Couples (Customers) can discover verified wedding services, search and filter by category or location, sort by price, and submit booking requests. Vendors can create studio profiles, publish wedding services, manage customer bookings, and upgrade to a monthly Premium subscription via **Stripe Checkout**. Administrators oversee registered users, moderate service listings, and monitor platform transactions.

---

## Live Website & Repository Links

* **Live Website Link:** [https://wedplan-client-cyan.vercel.app](https://wedplan-client-cyan.vercel.app)
* **Live API Server:** [https://wedplan-server-orpin.vercel.app](https://wedplan-server-orpin.vercel.app)
* **Client Repository:** [https://github.com/Rezanur2/wedplan-client](https://github.com/Rezanur2/wedplan-client)
* **Server Repository:** [https://github.com/Rezanur2/wedplan-server](https://github.com/Rezanur2/wedplan-server)

---

## Important Features

### 1. Public Marketplace & Discovery
* **Home Page:** Wedding-themed hero banner with quick search, dynamic **Featured Wedding Services** (approved & active listings), **6 Wedding Service Categories**, **Why Choose WedPlan?**, **How WedPlan Works**, smooth **Framer Motion** animations, and a floating **Back to Top** button.
* **Browse Services (`/services`):** Real-time keyword search, category and location filtering, price sorting (Low to High & High to Low), loading skeletons, and empty states.
* **Service Details (`/services/[id]`):** Protected details page (redirects unauthenticated users to Sign In) featuring multi-image gallery, transparent pricing, vendor info, and validated booking request form (blocks booking own services, non-customer bookings, paused/unapproved listings, and duplicate active dates).

### 2. Authentication & Security
* **Better Auth:** Email/password registration (with password strength rules), **Google OAuth** sign-in/sign-up with role preservation (`customer` or `vendor`), and **ImgBB** profile photo upload.
* **Role-Based Access Control:** Separate protected dashboards (`Customer`, `Vendor`, `Admin`) using server-side session checks (`requireRole`), blocked-user enforcement, and JWKS JWT verification on all protected Express API calls.
* **Profile Management:** Customers, Vendors, and Admins can update their display name and profile photo (plus `Business / Studio Name` for Vendors, synced to existing service listings), while self-updates to `role` and `subscriptionPlan` are blocked server-side.

### 3. Role-Based Dashboards
* **Customer Dashboard:** Booking statistics overview, detailed bookings table/mobile cards, booking cancellation for pending requests, and profile settings.
* **Vendor Dashboard:** Studio overview, My Services (availability toggle, edit, delete, filter tabs), Add Service (multi-image ImgBB upload, 3-service Free tier limit), Booking Requests (accept/reject pending requests), Monthly Premium Subscription (`$49/month` via **Stripe Checkout** with renewal/expiry tracking, period-end cancellation, and recent Payment History), and Profile Settings.
* **Admin Dashboard:** Platform overview with Total Revenue summary and recent service submissions, Manage Users (search, role filter, role update, block/unblock with immediate session invalidation), Manage Services (review modal, approve/reject/pause/delete, CSV export), and read-only Platform Transactions ledger (`Paid`, `Cancelled`, `Pending` status tracking and vendor avatars).

---

## Technology Stack

* **Framework & Language:** Next.js 16 (App Router), React 19, TypeScript
* **Styling & UI:** Tailwind CSS v4, ShadCN UI (`@base-ui/react`), Lucide React
* **Animations:** Framer Motion (`framer-motion`)
* **Authentication & Database Adapter:** Better Auth (`better-auth`, `@better-auth/mongo-adapter`) with JWT & Google OAuth
* **Backend API & Payments:** Express.js 5 REST API (`wedplan-server`), MongoDB, Stripe Checkout & Webhooks
* **Image Hosting:** ImgBB REST API

---

## Installation Instructions

### Prerequisites
* **Node.js** `v20+` and `npm`
* **MongoDB** database connection string (Atlas or local)
* **Stripe** account (Test Mode keys)
* **ImgBB** API key (and optional **Google OAuth** credentials)

### 1. Clone Both Repositories
Clone the client and server repositories into the same parent folder:
```bash
git clone https://github.com/Rezanur2/wedplan-client.git
git clone https://github.com/Rezanur2/wedplan-server.git
```

### 2. Install Dependencies
Install packages for the server:
```bash
cd wedplan-server
npm install
```

Install packages for the client:
```bash
cd ../wedplan-client
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in `wedplan-server/` (you can copy `wedplan-server/.env.example`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wedplandb
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in `wedplan-client/` (you can copy `wedplan-client/.env.example`):
```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wedplandb

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB Image Hosting
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Express Backend API URL (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## How to Run the Project Locally

Start the backend server and frontend client in separate terminals:

### 1. Run the Backend Server (`wedplan-server`)
```bash
cd wedplan-server
npm start
```
The Express API server will run at `http://localhost:5000`.

### 2. Run the Frontend Client (`wedplan-client`)
```bash
cd wedplan-client
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Forward Stripe Webhooks Locally (Optional — for testing Premium upgrades locally)
```bash
stripe listen --events checkout.session.completed,checkout.session.expired,customer.subscription.updated,customer.subscription.deleted --forward-to localhost:5000/api/webhooks/stripe
```
Copy the printed `whsec_...` signing secret into `wedplan-server/.env` as `STRIPE_WEBHOOK_SECRET` and restart the server.

---

## Available Scripts (`wedplan-client`)

* `npm run dev` — Starts the Next.js development server on port `3000`.
* `npm run build` — Creates an optimized production build.
* `npm run start` — Runs the production build locally.
* `npm run lint` — Runs ESLint checks across the codebase.
