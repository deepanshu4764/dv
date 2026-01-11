import Link from "next/link";
import { format, differenceInMinutes, isAfter } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requirePremium } from "@/lib/access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function LiveClassesPage() {
  const { session } = await requirePremium();
  const classes = await prisma.liveClass.findMany({
    orderBy: { startTime: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Premium live classes</h1>
          <p className="text-slate-600">
            Premium subscribers get 4 live sessions per month. Links are emailed manually.
          </p>
        </div>
        <Link href="/app">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((liveClass) => (
          <Card key={liveClass.id} className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {format(liveClass.startTime, "EEE, dd MMM yyyy · h:mma")}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{liveClass.title}</h3>
            <p className="text-sm text-slate-600">{liveClass.description}</p>
            <p className="mt-2 text-sm text-slate-600">
              Duration: {liveClass.duration} mins · Status: {liveClass.status.toLowerCase()}
            </p>
            {liveClass.recordingUrl ? (
              <a
                href={liveClass.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-primary-700"
              >
                View recording
              </a>
            ) : null}
            {!liveClass.recordingUrl && liveClass.meetingLink ? (
              <p className="mt-3 text-xs text-slate-500">
                Join link available 30 minutes before start.
              </p>
            ) : null}
            {liveClass.meetingLink &&
            differenceInMinutes(liveClass.startTime, new Date()) <= 30 &&
            isAfter(new Date(liveClass.startTime.getTime() + liveClass.duration * 60000), new Date()) ? (
              <a
                href={liveClass.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-primary-700"
              >
                Join live session
              </a>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
