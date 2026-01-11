"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPlanByQuery } from "@/data/plans";
import { formatInr } from "@/lib/subscription";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const planKey = (searchParams.get("plan") as "daily" | "premium" | null) ?? "daily";
  const plan = useMemo(() => getPlanByQuery(planKey), [planKey]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams.get("plan")) {
      router.replace("/checkout?plan=daily");
    }
  }, [router, searchParams]);

  const startCheckout = async () => {
    setError(null);
    setLoading(true);
    if (status === "unauthenticated") {
      await signIn(undefined, { callbackUrl: `/checkout?plan=${planKey}` });
      return;
    }
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: planKey })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to start checkout");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!window.Razorpay) {
        setError("Razorpay SDK not loaded.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Book Insights",
        description: plan.name,
        prefill: {
          name: data.user?.name ?? "",
          email: data.user?.email ?? ""
        },
        notes: {
          plan: plan.name
        },
        handler: () => {
          router.push("/app");
        }
      });

      rzp.on("payment.failed", (resp: any) => {
        console.error(resp);
        setError("Payment failed, please retry.");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="mx-auto max-w-3xl">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-1 text-slate-600">Confirm your subscription and complete payment.</p>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{plan.name}</p>
            <p className="text-sm text-slate-600">{plan.description}</p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {formatInr(plan.priceMonthly)} <span className="text-sm text-slate-600">per month</span>
            </p>
          </div>
          <Button className="mt-6 w-full" onClick={startCheckout} disabled={loading}>
            {loading ? "Creating subscription..." : "Pay with Razorpay"}
          </Button>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          <p className="mt-4 text-xs text-slate-500">
            We don&apos;t store card details. Razorpay handles payments securely.
          </p>
        </Card>
      </div>
    </>
  );
}
