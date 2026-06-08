# Razorpay Integration

This project now has a shared Razorpay payment system for Deepanshu Ventures, AnyTimeTiffin, AI Automation Agency, Social Drive Marketing Agency, and future ventures.

## Files Added Or Changed

- `.env.example` lists all Razorpay and payment redirect environment variables.
- `lib/razorpay.ts` initializes Razorpay on the server and verifies signatures.
- `lib/payments/catalog.ts` validates ventures, order types, amounts, and AnyTimeTiffin cart totals from server-side menu data.
- `lib/payments/store.ts` is a temporary in-memory payment adapter with TODO comments for a real database.
- `app/api/payments/create-order/route.ts` creates Razorpay Orders.
- `app/api/payments/verify/route.ts` verifies checkout signatures.
- `app/api/razorpay/webhook/route.ts` verifies and handles Razorpay webhooks.
- `app/api/payments/route.ts` lists placeholder payment attempts for admin use.
- `components/payments/RazorpayCheckoutButton.tsx` is the reusable checkout button.
- `components/payments/PaymentRequestForm.tsx` powers the custom payment page.
- `app/pay/page.tsx` is the custom payment route.
- `app/payments/admin/page.tsx` is the internal placeholder payment dashboard.
- `public/anytimetiffin-order/*` and `AnyTimeTiffin/*` now support Razorpay online payment plus COD/pay later.
- AI Automation Agency and Social Drive static pages now open `/pay/` for package payments.

## Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_NAME=Deepanshu Ventures
NEXT_PUBLIC_APP_URL=https://www.deepanshuventures.com
PAYMENT_SUCCESS_REDIRECT_URL=https://www.deepanshuventures.com/pay/
PAYMENT_FAILURE_REDIRECT_URL=https://www.deepanshuventures.com/pay/
```

Use Razorpay Test mode first. Production works by replacing the test key ID, key secret, and webhook secret with live values.

## How To Get Razorpay Test Keys

1. Log in to the Razorpay Dashboard.
2. Switch to Test Mode.
3. Go to Account & Settings -> API Keys.
4. Generate a test key.
5. Put the key ID in `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
6. Put the key secret only in `RAZORPAY_KEY_SECRET`.

Never expose `RAZORPAY_KEY_SECRET` in frontend code.

## Webhook Setup

In Razorpay Dashboard -> Account & Settings -> Webhooks, add:

```text
https://www.deepanshuventures.com/api/razorpay/webhook
```

Enable these events:

- `payment.captured`
- `payment.failed`
- `order.paid`
- `refund.processed`

Copy the webhook signing secret into `RAZORPAY_WEBHOOK_SECRET`.

## How To Test

Run locally:

```bash
npm install
npm run dev -- -H 127.0.0.1 -p 3000
```

Open:

```text
http://127.0.0.1:3000/pay/
http://127.0.0.1:3000/anytimetiffin-order/index.html
http://127.0.0.1:3000/payments/admin/
```

Use Razorpay test cards/UPI from Razorpay documentation. A payment is marked successful only after `/api/payments/verify` validates the signature.

## Adding Future Ventures

1. Add the venture to `paymentVentures` in `lib/payments/catalog.ts`.
2. Use `RazorpayCheckoutButton` in any React page, or send users to `/pay/?venture=venture-id&amount=999&purpose=...`.
3. If the venture has a fixed catalog, add server-side catalog validation before trusting payment amounts.
4. Connect `lib/payments/store.ts` to Prisma, Firestore, Supabase, or another durable database.

## Current Database Status

No Prisma, Firebase, or Firestore database is configured in this repo. Payment attempts are stored in a temporary in-memory adapter so the project builds and the architecture is ready. For production reconciliation, connect a durable database before depending on `/payments/admin/`.

Recommended durable model fields:

- `id`
- `ventureId`
- `ventureName`
- `orderType`
- `amount`
- `currency`
- `customerName`
- `customerPhone`
- `customerEmail`
- `razorpayOrderId`
- `razorpayPaymentId`
- `razorpaySignature`
- `status`
- `notes`
- `cartItems`
- `createdAt`
- `updatedAt`

## Common Errors

- `RAZORPAY_KEY_ID is missing`: add the key ID in local `.env.local` or Vercel.
- `RAZORPAY_KEY_SECRET is missing`: add the key secret server-side only.
- `Payment signature verification failed`: the payment response is invalid or keys do not match the Razorpay account.
- `Invalid Razorpay webhook signature`: webhook secret does not match the Dashboard webhook secret.
- AnyTimeTiffin cart amount mismatch: server recalculates menu totals from `lib/payments/catalog.ts`; update that catalog when menu prices change.
