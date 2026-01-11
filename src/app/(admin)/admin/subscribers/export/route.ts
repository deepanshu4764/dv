import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";

export async function GET(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const plan = searchParams.get("plan") || undefined;
  const status = searchParams.get("status") || undefined;

  const subs = await prisma.subscription.findMany({
    where: {
      ...(plan ? { plan: plan as any } : {}),
      ...(status ? { status: status as any } : {}),
      user: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } }
        ]
      }
    },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  const header = [
    "name",
    "email",
    "plan",
    "status",
    "start_date",
    "renewal_date",
    "last_payment_at",
    "razorpay_subscription_id"
  ];

  const rows = subs.map((sub) => [
    sub.user.name ?? "",
    sub.user.email,
    sub.plan,
    sub.status,
    sub.currentPeriodStart?.toISOString() ?? "",
    sub.currentPeriodEnd?.toISOString() ?? "",
    sub.lastPaymentAt?.toISOString() ?? "",
    sub.razorpaySubscriptionId ?? ""
  ]);

  const csv = [header, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="subscribers.csv"`
    }
  });
}
