import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getUserSubscriptionStatus } from "./subscription";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireActiveSubscription() {
  const session = await requireUser();
  const status = await getUserSubscriptionStatus(session.user.id);
  if (!status.isActive) {
    redirect("/pricing");
  }
  return { session, subscription: status.subscription, isPremium: status.isPremium };
}

export async function requirePremium() {
  const { session, subscription, isPremium } = await requireActiveSubscription();
  if (!isPremium) {
    redirect("/app");
  }
  return { session, subscription };
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/app");
  }
  return session;
}
