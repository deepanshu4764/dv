import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/data/plans";

export default async function SubscriberDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const subscription = await prisma.subscription.findUnique({
    where: { id: params.id },
    include: { user: true, paymentEvents: { orderBy: { createdAt: "desc" } } }
  });

  if (!subscription) {
    notFound();
  }

  const history = await prisma.subscription.findMany({
    where: { userId: subscription.userId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{subscription.user.name ?? "Subscriber"}</h1>
          <p className="text-slate-600">{subscription.user.email}</p>
        </div>
        <Link className="text-sm font-semibold text-primary-700" href="/admin/subscribers">
          Back to list
        </Link>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">
            {subscription.plan === "PREMIUM_499" ? plans.premium.name : plans.daily.name}
          </Badge>
          <Badge variant="success">{subscription.status}</Badge>
          {subscription.currentPeriodEnd ? (
            <span className="text-sm text-slate-600">
              Renews on {format(subscription.currentPeriodEnd, "dd MMM yyyy")}
            </span>
          ) : null}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Started</p>
            <p className="text-sm text-slate-700">
              {subscription.currentPeriodStart ? format(subscription.currentPeriodStart, "dd MMM yyyy") : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Last payment</p>
            <p className="text-sm text-slate-700">
              {subscription.lastPaymentAt ? format(subscription.lastPaymentAt, "dd MMM yyyy") : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Next charge</p>
            <p className="text-sm text-slate-700">
              {subscription.nextChargeAt ? format(subscription.nextChargeAt, "dd MMM yyyy") : "—"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900">Subscription history</h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {history.map((sub) => (
              <li key={sub.id} className="py-3 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>{sub.plan === "PREMIUM_499" ? plans.premium.name : plans.daily.name}</span>
                  <span className="text-xs uppercase text-slate-500">{sub.status}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Period:{" "}
                  {sub.currentPeriodStart ? format(sub.currentPeriodStart, "dd MMM yyyy") : "—"} —{" "}
                  {sub.currentPeriodEnd ? format(sub.currentPeriodEnd, "dd MMM yyyy") : "—"}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900">Payment events</h3>
          <ul className="mt-3 divide-y divide-slate-100">
            {subscription.paymentEvents.map((evt) => (
              <li key={evt.id} className="py-3 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>{evt.eventType}</span>
                  <span className="text-xs text-slate-500">{format(evt.createdAt, "dd MMM yyyy HH:mm")}</span>
                </div>
                <p className="text-xs text-slate-500">Provider ID: {evt.providerEventId ?? "—"}</p>
              </li>
            ))}
            {subscription.paymentEvents.length === 0 ? (
              <li className="py-3 text-sm text-slate-600">No events logged yet.</li>
            ) : null}
          </ul>
        </Card>
      </div>
    </div>
  );
}
