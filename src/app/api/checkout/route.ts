import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { plans } from "@/data/plans";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const razorpay = getRazorpay();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const planKey = (body?.plan as "daily" | "premium" | undefined) ?? "daily";
    const plan = plans[planKey];

    const planId =
      planKey === "premium"
        ? process.env.RAZORPAY_PLAN_ID_PREMIUM
        : process.env.RAZORPAY_PLAN_ID_DAILY;

    if (!plan || !planId) {
      return NextResponse.json(
        { error: "Plan configuration missing. Please set Razorpay plan IDs." },
        { status: 400 }
      );
    }

    const razorpayResponse = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      customer_notify: 1,
      notes: {
        userId: session.user.id,
        plan: plan.name
      }
    });

    const subscriptionPlan =
      planKey === "premium" ? SubscriptionPlan.PREMIUM_499 : SubscriptionPlan.DAILY_99;

    await prisma.subscription.upsert({
      where: { razorpaySubscriptionId: razorpayResponse.id },
      update: {
        plan: subscriptionPlan,
        status: SubscriptionStatus.PAST_DUE,
        razorpayCustomerId: razorpayResponse.customer_id ?? undefined,
        currentPeriodStart: razorpayResponse.current_start
          ? new Date(razorpayResponse.current_start * 1000)
          : undefined,
        currentPeriodEnd: razorpayResponse.current_end
          ? new Date(razorpayResponse.current_end * 1000)
          : undefined,
        nextChargeAt: razorpayResponse.charge_at
          ? new Date(razorpayResponse.charge_at * 1000)
          : undefined,
        lastPaymentAt: null
      },
      create: {
        user: { connect: { id: session.user.id } },
        plan: subscriptionPlan,
        status: SubscriptionStatus.PAST_DUE,
        razorpayCustomerId: razorpayResponse.customer_id ?? null,
        razorpaySubscriptionId: razorpayResponse.id,
        currentPeriodStart: razorpayResponse.current_start
          ? new Date(razorpayResponse.current_start * 1000)
          : null,
        currentPeriodEnd: razorpayResponse.current_end
          ? new Date(razorpayResponse.current_end * 1000)
          : null,
        nextChargeAt: razorpayResponse.charge_at
          ? new Date(razorpayResponse.charge_at * 1000)
          : null
      }
    });

    return NextResponse.json({
      subscriptionId: razorpayResponse.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan,
      user: {
        name: session.user.name,
        email: session.user.email
      }
    });
  } catch (error) {
    console.error("[RAZORPAY_CHECKOUT]", error);
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
  }
}
