import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const subStatus = await getUserSubscriptionStatus(session.user.id);
  const insights = await prisma.insight.findMany({
    where: { status: "PUBLISHED", publishAt: { lte: new Date() } },
    orderBy: { publishAt: "desc" }
  });

  const preview = insights[0];

  if (!subStatus.isActive) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Insights</h1>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900">Subscribe to unlock insights</h2>
          <p className="mt-2 text-slate-600">
            Active subscribers get daily book insights and archive access. Here&apos;s a preview.
          </p>
          {preview ? (
            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">{preview.title}</p>
              <p className="text-xs text-slate-500">
                {preview.bookName} · {preview.author}
              </p>
              <p className="text-sm text-slate-700">
                {preview.content.slice(0, 180)}...
              </p>
            </div>
          ) : null}
          <Link href="/pricing">
            <Button className="mt-4">Choose a plan</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Insights archive</h1>
          <p className="text-slate-600">All published insights available while your subscription is active.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <Card key={insight.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {format(insight.publishAt, "dd MMM yyyy")}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{insight.title}</h3>
                <p className="text-sm text-slate-600">
                  {insight.bookName} · {insight.author}
                </p>
              </div>
              <Link href={`/app/insights/${insight.slug}`}>
                <Button variant="secondary">Read</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
