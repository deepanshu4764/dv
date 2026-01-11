import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function InsightDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [insight, subStatus] = await Promise.all([
    prisma.insight.findUnique({ where: { slug: params.slug } }),
    getUserSubscriptionStatus(session.user.id)
  ]);

  if (!insight || insight.status !== "PUBLISHED" || insight.publishAt > new Date()) {
    notFound();
  }

  const canViewFull = subStatus.isActive;
  const previewLength = Math.max(100, Math.floor(insight.content.length * 0.1));
  const content = canViewFull ? insight.content : `${insight.content.slice(0, previewLength)}...`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {format(insight.publishAt, "dd MMM yyyy")}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{insight.title}</h1>
          <p className="text-slate-600">
            {insight.bookName} · {insight.author}
          </p>
        </div>
        <Link href="/app/insights">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <Card className="prose max-w-none p-6">
        <ReactMarkdown>{content}</ReactMarkdown>
      </Card>

      {insight.audioUrl ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Audio version</h3>
          <audio controls className="mt-3 w-full">
            <source src={insight.audioUrl} />
          </audio>
        </Card>
      ) : null}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900">Key takeaways</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          {insight.keyTakeaways.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </Card>

      {!canViewFull ? (
        <Card className="border border-primary-200 bg-primary-50 p-6">
          <h3 className="text-lg font-semibold text-primary-900">Unlock full insights</h3>
          <p className="mt-2 text-primary-800">
            Subscribe to get the complete insight and the full archive.
          </p>
          <Link href="/pricing">
            <Button className="mt-3">Choose a plan</Button>
          </Link>
        </Card>
      ) : null}
    </div>
  );
}
