import type { Metadata } from 'next';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { PaymentRequestForm } from '@/components/payments/PaymentRequestForm';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Secure Payment',
  description: 'Create a secure Razorpay payment for Deepanshu Ventures, AnyTimeTiffin, AI Automation Agency, or Social Drive Marketing Agency.',
  alternates: {
    canonical: '/pay/'
  },
  robots: {
    index: false,
    follow: false
  }
};

type PayPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function PayPage({ searchParams }: PayPageProps) {
  const params = await searchParams;
  const venture = getParam(params, 'venture');
  const amount = getParam(params, 'amount');
  const purpose = getParam(params, 'purpose');

  return (
    <section className="container py-28">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="glass rounded-[2rem] p-8">
          <CreditCard className="h-10 w-10 text-blue-200" aria-hidden="true" />
          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">Secure Razorpay payment</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Use this page for Deepanshu Ventures payments, agency advances, consultation booking, package payments, custom invoices, and
            venture payments.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold text-slate-300">
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-200" aria-hidden="true" />
              Razorpay key secrets stay server-side.
            </p>
            <p>Success is accepted only after server-side signature verification.</p>
            <p>Official URL: {siteUrl}/pay/</p>
          </div>
        </div>
        <PaymentRequestForm initialVenture={venture} initialAmount={amount} initialPurpose={purpose} />
      </div>
    </section>
  );
}
