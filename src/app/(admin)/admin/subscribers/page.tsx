import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { plans } from "@/data/plans";

export default async function SubscribersPage({
  searchParams
}: {
  searchParams: { q?: string; plan?: string; status?: string };
}) {
  await requireAdmin();

  const q = searchParams.q ?? "";
  const planFilter = searchParams.plan;
  const statusFilter = searchParams.status;

  const [subscribers, activeCount, premiumCount, churnCount] = await Promise.all([
    prisma.subscription.findMany({
      where: {
        ...(planFilter
          ? {
              plan: planFilter === "PREMIUM_499" ? "PREMIUM_499" : planFilter === "DAILY_99" ? "DAILY_99" : undefined
            }
          : {}),
        ...(statusFilter ? { status: statusFilter as any } : {}),
        user: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } }
          ]
        }
      },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "ACTIVE", plan: "PREMIUM_499" } }),
    prisma.subscription.count({ where: { status: { in: ["CANCELLED", "EXPIRED", "PAUSED"] } } })
  ]);

  const mrr = activeCount * 99 + premiumCount * (499 - 99);

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "muted" | "default" }> =
    {
      ACTIVE: { label: "Active", variant: "success" },
      PAST_DUE: { label: "Past due", variant: "warning" },
      CANCELLED: { label: "Cancelled", variant: "muted" },
      EXPIRED: { label: "Expired", variant: "danger" },
      PAUSED: { label: "Paused", variant: "warning" }
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscribers</h1>
          <p className="text-slate-600">Track subscriptions, status, and recent payments.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/insights/new"
          >
            + New insight
          </Link>
          <Link
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/live-classes/new"
          >
            + New live class
          </Link>
          <a
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href={`/admin/subscribers/export?plan=${planFilter ?? ""}&status=${statusFilter ?? ""}&q=${q}`}
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Active subscribers</p>
          <p className="text-2xl font-semibold text-slate-900">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">MRR (approx)</p>
          <p className="text-2xl font-semibold text-slate-900">₹{mrr}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Churned / paused</p>
          <p className="text-2xl font-semibold text-slate-900">{churnCount}</p>
        </Card>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-4">
          <Input name="q" placeholder="Search name or email" defaultValue={q} />
          <Select name="plan" defaultValue={planFilter ?? ""}>
            <option value="">All plans</option>
            <option value="DAILY_99">Daily Insights</option>
            <option value="PREMIUM_499">Premium</option>
          </Select>
          <Select name="status" defaultValue={statusFilter ?? ""}>
            <option value="">All status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAST_DUE">Past due</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
            <option value="PAUSED">Paused</option>
          </Select>
          <Button type="submit">Filter</Button>
        </form>
      </Card>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">Renewal</th>
              <th className="px-4 py-3">Last payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/subscribers/${sub.id}`} className="font-semibold text-slate-900">
                    {sub.user.name ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{sub.user.email}</td>
                <td className="px-4 py-3 text-slate-700">
                  {sub.plan === "PREMIUM_499" ? plans.premium.name : plans.daily.name}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusMap[sub.status]?.variant ?? "default"}>
                    {statusMap[sub.status]?.label ?? sub.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {sub.currentPeriodStart ? format(sub.currentPeriodStart, "dd MMM yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {sub.currentPeriodEnd ? format(sub.currentPeriodEnd, "dd MMM yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {sub.lastPaymentAt ? format(sub.lastPaymentAt, "dd MMM yyyy") : "—"}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-600" colSpan={7}>
                  No subscribers found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
