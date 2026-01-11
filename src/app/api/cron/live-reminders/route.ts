import { addHours, isAfter, isBefore } from "date-fns";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

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

  const now = new Date();
  const in24h = addHours(now, 24);
  const in1h = addHours(now, 1);

  const classes = await prisma.liveClass.findMany({
    where: {
      status: "SCHEDULED",
      startTime: { gte: now, lte: in24h }
    }
  });

  if (!classes.length) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const premiumSubs = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      plan: "PREMIUM_499",
      currentPeriodEnd: { gt: new Date() },
      user: { dailyEmailOptIn: true }
    },
    include: { user: true }
  });

  let sent = 0;

  for (const liveClass of classes) {
    const isOneHourWindow = isBefore(liveClass.startTime, in1h);
    const subject = isOneHourWindow
      ? `Starting soon: ${liveClass.title}`
      : `Live class in 24h: ${liveClass.title}`;
    const body = `<h3>${liveClass.title}</h3>
<p>${liveClass.description}</p>
<p>Starts at: ${liveClass.startTime.toUTCString()}</p>
${liveClass.meetingLink ? `<p>Join link: ${liveClass.meetingLink}</p>` : ""}
<p><a href="${process.env.NEXTAUTH_URL ?? ""}/app/live">View schedule</a></p>`;

    const toEmails = premiumSubs
      .filter((sub) => sub.user?.email)
      .map((sub) => sub.user.email as string);

    if (toEmails.length) {
      await resend.emails.send({
        from: fromAddress,
        to: toEmails,
        subject,
        html: body
      });
      sent += toEmails.length;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
