import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { prisma } from "./prisma";

export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: {
        gt: new Date()
      }
    },
    orderBy: {
      currentPeriodEnd: "desc"
    }
  });
}

export async function getUserSubscriptionStatus(userId: string) {
  const subscription = await getActiveSubscription(userId);
  return {
    subscription,
    isActive: !!subscription,
    isPremium: subscription?.plan === SubscriptionPlan.PREMIUM_499
  };
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0
  }).format(amount);
}
