import { SubscriptionPlan } from "@prisma/client";
import { Resend } from "resend";

const resendApiKey = process.env.EMAIL_PROVIDER_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromAddress = process.env.EMAIL_FROM ?? "Book Insights <no-reply@bookinsights.test>";

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!resend) return;
  await resend.emails.send({
    from: fromAddress,
    to: opts.to,
    subject: opts.subject,
    html: opts.html
  });
}

export async function sendWelcomeEmail({
  to,
  plan
}: {
  to: string;
  plan: SubscriptionPlan;
}) {
  const planName = plan === SubscriptionPlan.PREMIUM_499 ? "Premium" : "Daily Insights";
  await sendEmail({
    to,
    subject: `Welcome to ${planName} — Book Insights`,
    html: `<h2>Welcome to ${planName}</h2>
<p>Your subscription is active. You now have access to daily insights${plan === SubscriptionPlan.PREMIUM_499 ? " and premium live classes" : ""}.</p>
<p>Log in to start reading: <a href="${process.env.NEXTAUTH_URL ?? ""}/app">Open dashboard</a></p>`
  });
}

export async function sendPaymentFailureEmail({
  to,
  plan
}: {
  to: string;
  plan: SubscriptionPlan;
}) {
  const planName = plan === SubscriptionPlan.PREMIUM_499 ? "Premium" : "Daily Insights";
  await sendEmail({
    to,
    subject: `Payment issue on your ${planName} plan`,
    html: `<h2>Payment failed</h2>
<p>We could not process your payment for ${planName}. Please update your payment method in Razorpay or contact support.</p>`
  });
}
