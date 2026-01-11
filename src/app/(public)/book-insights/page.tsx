import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BookInsightsLanding() {
  const bullets = [
    "Daily 5-minute summaries of high-impact books",
    "Access to the full archive while subscribed",
    "Premium plan adds 4 live classes with recordings"
  ];

  return (
    <div className="space-y-12">
      <section className="grid gap-10 rounded-3xl bg-gradient-to-r from-primary-900 via-primary-700 to-primary-500 px-10 py-12 text-white shadow-card md:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Daily insights + premium live classes
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Turn books into action with concise daily insights.
          </h1>
          <p className="text-lg text-white/80">
            Two plans built for busy learners. Get one actionable idea every day or go premium
            for weekly live classes and recordings.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/pricing">
              <Button className="px-6 py-3 text-base">
                View plans <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                Start free account
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/80">
            {bullets.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <Card className="relative overflow-hidden bg-white/10 text-white backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
          <div className="relative space-y-6 p-8">
            <p className="text-sm uppercase tracking-wide text-white/80">Today&apos;s insight</p>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Atomic Habits</h3>
              <p className="text-sm text-white/80">James Clear</p>
              <p className="text-base leading-relaxed text-white/90">
                Focus on systems, not goals. Make habits obvious, attractive, easy, and satisfying.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  1
                </span>
                Identity-based habits rewrite who you are becoming.
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  2
                </span>
                Stack new behaviors on top of existing routines.
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  3
                </span>
                Design your environment to make the right choice the easy choice.
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Daily delivery",
            description: "One concise insight every day. Perfect for busy founders and operators."
          },
          {
            title: "Live classes",
            description: "Premium plan includes 4 live sessions per month + recordings when available."
          },
          {
            title: "Admin clarity",
            description:
              "Track subscribers, payments, and history with filters, search, and CSV exports."
          }
        ].map((card) => (
          <Card key={card.title} className="p-6">
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{card.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">FAQs</h3>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Can I cancel anytime?</p>
              <p className="text-sm text-slate-600">Yes. Cancel from the dashboard; access stays until the end of the period.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Do Premium classes include recordings?</p>
              <p className="text-sm text-slate-600">Yes, recordings are added after each session for Premium subscribers.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">How do daily emails work?</p>
              <p className="text-sm text-slate-600">Turn on the toggle in your dashboard to get the day&apos;s insight in your inbox.</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900">Testimonials</h3>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-700">
              “The daily insights keep me learning without the overwhelm.” — Aditi, founder
            </p>
            <p className="text-sm text-slate-700">
              “Premium classes plus replays are worth every rupee.” — Rohan, product lead
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
