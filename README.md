# Book Insights – Subscriptions and Admin Dashboard

Production-ready subscription flow for daily book insights and premium live classes using Next.js App Router, TypeScript, Tailwind, Prisma (Postgres), NextAuth, Razorpay Subscriptions, and Resend.

## Stack
- Next.js 14 (App Router) + TypeScript + TailwindCSS
- NextAuth (credentials) + Prisma Adapter
- Postgres via Prisma
- Razorpay Subscriptions (India) for billing
- Resend (optional) for transactional emails

## Getting started
1) Install deps
```bash
npm install
```

2) Environment variables (`.env`)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/book_insights"
AUTH_SECRET="generate-with: openssl rand -hex 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="secret_xxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxx"
RAZORPAY_PLAN_ID_DAILY="plan_id_for_₹99_subscription"
RAZORPAY_PLAN_ID_PREMIUM="plan_id_for_₹499_subscription"

EMAIL_PROVIDER_API_KEY="resend_api_key" # optional
EMAIL_FROM="Book Insights <no-reply@yourdomain.com>"
CRON_SECRET="secure-string" # used by /api/cron/* endpoints
S3_ENDPOINT="https://s3.example.com" # optional if storing audio/recordings
S3_ACCESS_KEY=""
S3_SECRET_KEY=""
S3_BUCKET=""
```

3) Database
```bash
npx prisma migrate dev --name init
npm run seed
```

Seed accounts:
- Admin: `admin@bookinsights.test` / `admin123`
- User: `reader@bookinsights.test` / `user123`

4) Start dev server
```bash
npm run dev
```

## Razorpay setup
- Create two **Plans** in Razorpay dashboard (₹99 monthly, ₹499 monthly) and paste IDs into `RAZORPAY_PLAN_ID_DAILY` / `RAZORPAY_PLAN_ID_PREMIUM`.
- Create a **Webhook** pointing to `/api/webhooks/razorpay` with the secret in `RAZORPAY_WEBHOOK_SECRET`. Enable subscription/payment events (`subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.captured`, `payment.failed`, etc).

## Cron (Vercel Cron or similar)
- `GET /api/cron/daily-insights` — sends today’s insight to active subscribers with `dailyEmailOptIn=true`. Protect with `CRON_SECRET` header `x-cron-secret`.
- `GET /api/cron/live-reminders` — sends 24h/1h reminders for upcoming live classes to active Premium subscribers (also requires `CRON_SECRET`).

## Key routes
- Public: `/book-insights`, `/pricing`, `/checkout?plan=daily|premium`
- Auth: `/auth/signin`, `/auth/signup`
- App (auth required): `/app`, `/app/insights`, `/app/insights/[slug]` (preview if inactive), `/app/live` (premium only)
- Admin (role=ADMIN): `/admin/subscribers` (filters/search/CSV), `/admin/subscribers/[id]`, `/admin/insights/new`, `/admin/live-classes/new`
- APIs: `/api/webhooks/razorpay`, `/api/checkout`, `/api/subscription/cancel`, `/api/auth/[...nextauth]`, `/api/register`

## Emails
- Resend used for welcome + payment failure emails (sent on webhook events). If `EMAIL_PROVIDER_API_KEY` is not set, email sends are skipped gracefully.

## Notes on behavior
- Subscription status is driven by Razorpay webhooks (signature verified). Client never determines status.
- Access checks:
  - `/app/live` requires active Premium.
  - Insights require active subscription; inactive users see a short preview + CTA.
- Admin CSV export at `/admin/subscribers/export` includes plan, status, dates, and Razorpay subscription id.
- “Manage subscription” provides a cancel action via Razorpay API; status updates also come from webhooks.

## Deploy
- Add environment variables to your hosting provider.
- Run migrations (`npx prisma migrate deploy`) and seed if desired.
- Ensure your deployment URL matches `NEXTAUTH_URL` and Razorpay webhook endpoint.
