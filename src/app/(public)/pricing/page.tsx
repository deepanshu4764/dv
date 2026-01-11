import Link from "next/link";
import { Check } from "lucide-react";
import { plans } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatInr } from "@/lib/subscription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Choose your plan</h1>
        <p className="text-lg text-slate-600">
          Daily insights for quick learning. Go premium to unlock weekly live classes and recordings.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(plans).map(([key, plan]) => (
          <Card key={key} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">{plan.name}</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {formatInr(plan.priceMonthly)}
                      <span className="text-base font-medium text-slate-500"> / month</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  </div>
                  {key === "premium" ? (
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                      Best for pros
                    </span>
                  ) : null}
                </div>
              </CardHeader>
              <CardBody className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-primary-600" />
                    {feature}
                  </div>
                ))}
              </CardBody>
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <Link href={`/checkout?plan=${key}`}>
                <Button className="w-full">
                  {session?.user ? "Subscribe" : "Sign in to subscribe"}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
