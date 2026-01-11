import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resendApiKey = process.env.EMAIL_PROVIDER_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromAddress = process.env.EMAIL_FROM ?? "Book Insights <no-reply@bookinsights.test>";

function assertCronAuth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("x-cron-secret") !== secret) {
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!assertCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!resend) {
    return NextResponse.json({ skipped: "No email provider configured" });
  }

  const todayInsight = await prisma.insight.findFirst({
    where: { status: "PUBLISHED", publishAt: { lte: new Date() } },
    orderBy: { publishAt: "desc" }
  });

  if (!todayInsight) {
    return NextResponse.json({ skipped: "No insight" });
  }

  const subscribers = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      currentPeriodEnd: { gt: new Date() },
      user: { dailyEmailOptIn: true }
    },
    include: { user: true }
  });

  const emails = subscribers
    .filter((sub) => sub.user?.email)
    .map((sub) => sub.user.email);

  if (!emails.length) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  await resend.emails.send({
    from: fromAddress,
    to: emails,
    subject: `Today's Insight: ${todayInsight.title}`,
    html: `<h2>${todayInsight.title}</h2>
<p>${todayInsight.shortSummary}</p>
<p><a href="${process.env.NEXTAUTH_URL ?? ""}/app/insights/${todayInsight.slug}">Read now</a></p>`
  });

  return NextResponse.json({ ok: true, sent: emails.length });
}
