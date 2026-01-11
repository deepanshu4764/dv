import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const active = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: { not: SubscriptionStatus.CANCELLED }
    },
    orderBy: { createdAt: "desc" }
  });

  if (!active?.razorpaySubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 404 });
  }

  try {
    const razorpay = getRazorpay();
    // Razorpay expects: cancel(subscriptionId, cancel_at_cycle_end?: number)
    await razorpay.subscriptions.cancel(String(active.razorpaySubscriptionId), 0);
  } catch (error) {
    console.error("[SUBSCRIPTION_CANCEL]", error);
  }

  await prisma.subscription.update({
    where: { id: active.id },
    data: {
      status: SubscriptionStatus.CANCELLED,
      currentPeriodEnd: active.currentPeriodEnd ?? new Date()
    }
  });

  return NextResponse.json({ ok: true });
}
