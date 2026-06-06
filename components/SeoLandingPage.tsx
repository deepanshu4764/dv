import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LeadForm } from '@/components/LeadForm';
import { brand, capabilities, keywordClusters } from '@/lib/site';

type SeoLandingPageProps = {
  page: {
    slug: string;
    h1: string;
    title: string;
    description: string;
    focus: string;
    icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  };
};

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  const Icon = page.icon;

  return (
    <>
      <section className="container pt-32 pb-16">
        <div className="glass rounded-[2rem] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white text-midnight">
              <Icon className="h-12 w-12" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">SEO authority page</p>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl">{page.h1}</h1>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{page.description}</p>
              <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold leading-7 text-blue-100">
                Focus keywords: {page.focus}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-5 pb-16 md:grid-cols-3">
        {[
          'Official Deepanshu Ventures entity page with canonical brand language.',
          'Semantic copy written for Google, AI search, voice search, and local intent.',
          'Internal links connect this page to founder, company, AI, digital, and Gurgaon clusters.'
        ].map((item) => (
          <article key={item} className="card rounded-3xl p-6">
            <CheckCircle2 className="h-7 w-7 text-blue-200" aria-hidden="true" />
            <p className="mt-5 text-base leading-8 text-slate-300">{item}</p>
          </article>
        ))}
      </section>

      <section className="container grid gap-6 pb-20 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="card rounded-[2rem] p-8">
          <h2 className="text-3xl font-black text-white">Why this page exists</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            This page helps search engines understand that {brand.name} is the official company connected to {brand.founderFullName}.
            It supports branded search queries such as Deepanshu, Deepanshu Ventures, Deepanshu company, Deepanshu founder,
            Deepanshu startup, and Deepanshu official.
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            The content is structured to support topical authority, clear entity relationships, search intent matching, and strong
            internal linking across the Deepanshu Ventures website.
          </p>
        </article>
        <article className="glass rounded-[2rem] p-8">
          <h2 className="text-3xl font-black text-white">Related Deepanshu Ventures capabilities</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div key={capability.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-black text-white">{capability.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{capability.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="container pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card rounded-[2rem] p-8">
            <h2 className="text-3xl font-black text-white">Keyword cluster support</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {keywordClusters.map((cluster) => (
                <div key={cluster.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-black text-white">{cluster.title}</h3>
                  <ul className="mt-4 grid gap-2 text-sm text-slate-400">
                    {cluster.terms.map((term) => (
                      <li key={term}>{term}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-[2rem] p-8">
            <h2 className="text-3xl font-black text-white">Start a conversation</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Contact Deepanshu Ventures for AI, technology, digital, startup, branding, or innovation work in India.
            </p>
            <div className="mt-6">
              <LeadForm eventType="CONTACT_SUBMITTED" compact />
            </div>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-200">
              Return to homepage <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
