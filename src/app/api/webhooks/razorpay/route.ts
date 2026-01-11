import { PaymentProvider, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendPaymentFailureEmail, sendWelcomeEmail } from "@/lib/emails";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

function mapRazorpayStatus(status?: string): SubscriptionStatus | null {
  switch (status) {
    case "active":
    case "authenticated":
      return SubscriptionStatus.ACTIVE;
    case "cancelled":
      return SubscriptionStatus.CANCELLED;
    case "completed":
    case "expired":
      return SubscriptionStatus.EXPIRED;
    case "pending":
      return SubscriptionStatus.PAST_DUE;
    case "halted":
    case "paused":
      return SubscriptionStatus.PAUSED;
    default:
      return null;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event: string = payload?.event ?? "unknown";
  const subscriptionEntity = payload?.payload?.subscription?.entity;
  const paymentEntity = payload?.payload?.payment?.entity;

  const razorpaySubscriptionId: string | undefined =
    subscriptionEntity?.id ?? paymentEntity?.subscription_id;
  const providerEventId: string | undefined =
    paymentEntity?.id ?? subscriptionEntity?.id ?? payload?.payload?.id ?? payload?.id;

  const subscriptionRecord = razorpaySubscriptionId
    ? await prisma.subscription.findUnique({
        where: { razorpaySubscriptionId },
        include: { user: true }
      })
    : null;

  await prisma.paymentEvent.create({
    data: {
      provider: PaymentProvider.RAZORPAY,
      eventType: event,
      providerEventId,
      subscriptionId: subscriptionRecord?.id,
      userId: subscriptionRecord?.userId,
      payloadJson: payload
    }
  });

  if (subscriptionRecord) {
    const updateData: any = {};

    const mappedStatus = mapRazorpayStatus(subscriptionEntity?.status);
    if (mappedStatus) {
      updateData.status = mappedStatus;
    }

    if (subscriptionEntity?.current_start) {
      updateData.currentPeriodStart = new Date(subscriptionEntity.current_start * 1000);
    }
    if (subscriptionEntity?.current_end) {
      updateData.currentPeriodEnd = new Date(subscriptionEntity.current_end * 1000);
      updateData.nextChargeAt = new Date(subscriptionEntity.current_end * 1000);
    }
    if (subscriptionEntity?.charge_at) {
      updateData.nextChargeAt = new Date(subscriptionEntity.charge_at * 1000);
    }
    if (subscriptionEntity?.customer_id) {
      updateData.razorpayCustomerId = subscriptionEntity.customer_id;
    }

    if (event.includes("payment.captured") || event.includes("subscription.charged")) {
      updateData.lastPaymentAt = paymentEntity?.created_at
        ? new Date(paymentEntity.created_at * 1000)
        : new Date();
      updateData.status = SubscriptionStatus.ACTIVE;
    }

    if (event.includes("payment.failed")) {
      updateData.status = SubscriptionStatus.PAST_DUE;
    }

    if (event.includes("subscription.cancelled")) {
      updateData.status = SubscriptionStatus.CANCELLED;
    }

    await prisma.subscription.update({
      where: { id: subscriptionRecord.id },
      data: updateData
    });

    if (event.includes("subscription.activated") || event.includes("subscription.charged")) {
      await sendWelcomeEmail({
        to: subscriptionRecord.user.email,
        plan: subscriptionRecord.plan
      });
    }

    if (event.includes("payment.failed")) {
      await sendPaymentFailureEmail({
        to: subscriptionRecord.user.email,
        plan: subscriptionRecord.plan
      });
    }
  }

  return NextResponse.json({ ok: true });
}
