import { SubscriptionPlan } from "@prisma/client";

export type PlanKey = "daily" | "premium";

export const plans: Record<
  PlanKey,
  {
    id: SubscriptionPlan;
    name: string;
    priceMonthly: number;
    currency: "INR";
    description: string;
    features: string[];
  }
> = {
  daily: {
    id: SubscriptionPlan.DAILY_99,
    name: "Daily Insights",
    priceMonthly: 99,
    currency: "INR",
    description: "One book insight per day plus archive access.",
    features: ["1 curated insight every day", "Full archive access", "Email notifications"]
  },
  premium: {
    id: SubscriptionPlan.PREMIUM_499,
    name: "Premium",
    priceMonthly: 499,
    currency: "INR",
    description: "Daily insights plus premium live classes and recordings.",
    features: [
      "Everything in Daily Insights",
      "4 live classes / month",
      "Recordings for completed classes",
      "Priority support"
    ]
  }
};

export function getPlanByQuery(plan?: string) {
  if (plan === "premium") return plans.premium;
  return plans.daily;
}
