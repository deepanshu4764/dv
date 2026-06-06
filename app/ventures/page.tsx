import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { brand, siteUrl, ventures } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Deepanshu Ventures Portfolio | AI, Digital Growth & Local Business Ventures',
  description:
    'Explore Deepanshu Ventures portfolio surfaces across AI automation, digital growth, local SEO, technology, innovation, and startup execution in India.',
  alternates: {
    canonical: '/ventures/'
  }
};

export default function VenturesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Deepanshu Ventures Portfolio',
    url: `${siteUrl}/ventures/`,
    description: 'Portfolio and venture surfaces for Deepanshu Ventures.',
    publisher: {
      '@id': `${siteUrl}/#organization`
    }
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="container pt-32 pb-20">
        <div className="glass rounded-[2rem] p-8 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">Portfolio</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Deepanshu Ventures portfolio and venture surfaces
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            {brand.name} builds connected venture surfaces for AI, digital growth, local authority, websites, technology systems,
            and startup innovation in India.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ventures.map((venture) => (
            <Link key={venture.href} href={venture.href} className="card group rounded-3xl p-6 transition hover:-translate-y-1">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-midnight">{venture.tag}</span>
              <h2 className="mt-6 text-2xl font-black text-white">{venture.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{venture.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-200">
                Open venture page <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
