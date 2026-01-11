import Link from "next/link";
import { format } from "date-fns";
import { authOptions } from "@/lib/auth";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyEmailToggle } from "@/components/daily-email-toggle";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Please sign in to view your subscription.</p>
        <Link href="/auth/signin">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  const [subscriptionStatus, user] = await Promise.all([
    getUserSubscriptionStatus(session.user.id),
    prisma.user.findUnique({ where: { id: session.user.id } })
  ]);
  const nextInsight = await prisma.insight.findFirst({
    where: { status: "PUBLISHED", publishAt: { lte: new Date() } },
    orderBy: { publishAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-600">Manage your subscription and start reading insights.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/app/insights">
            <Button>Open insights</Button>
          </Link>
          <Link href="/app/live">
            <Button variant="secondary">Live classes</Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-600">Current plan</p>
            <p className="text-xl font-semibold text-slate-900">
              {subscriptionStatus.subscription?.plan === "PREMIUM_499"
                ? "Premium (₹499/mo)"
                : subscriptionStatus.subscription
                  ? "Daily Insights (₹99/mo)"
                  : "No active subscription"}
            </p>
            <p className="text-sm text-slate-600">
              Status: {subscriptionStatus.subscription?.status ?? "Not active"}
            </p>
            {subscriptionStatus.subscription?.currentPeriodEnd ? (
              <p className="text-sm text-slate-600">
                Renewal date: {format(subscriptionStatus.subscription.currentPeriodEnd, "dd MMM yyyy")}
              </p>
            ) : null}
            {subscriptionStatus.subscription ? (
              <div className="mt-2 inline-flex items-center gap-2">
                <Badge variant={subscriptionStatus.subscription.plan === "PREMIUM_499" ? "success" : "default"}>
                  {subscriptionStatus.subscription.plan === "PREMIUM_499" ? "Premium" : "Daily"}
                </Badge>
                <Badge variant={subscriptionStatus.subscription.status === "ACTIVE" ? "success" : "warning"}>
                  {subscriptionStatus.subscription.status}
                </Badge>
              </div>
            ) : null}
          </div>
          <div className="flex gap-3">
            {subscriptionStatus.isActive ? (
              <form action="/api/subscription/cancel" method="post">
                <Button variant="secondary" type="submit">
                  Cancel subscription
                </Button>
              </form>
            ) : (
              <Link href="/pricing">
                <Button>Subscribe</Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <DailyEmailToggle initial={user?.dailyEmailOptIn ?? true} />
        <p className="mt-3 text-xs text-slate-500">
          Daily emails are sent only to active subscribers and include the link to today&apos;s insight.
        </p>
      </Card>

      {nextInsight ? (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">Latest insight</p>
              <h3 className="text-xl font-semibold text-slate-900">{nextInsight.title}</h3>
              <p className="text-sm text-slate-600">
                {nextInsight.bookName} · {nextInsight.author}
              </p>
            </div>
            <Link href={`/app/insights/${nextInsight.slug}`}>
              <Button variant="secondary">Read</Button>
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
