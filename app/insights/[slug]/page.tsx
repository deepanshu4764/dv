import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { brand, insightPosts, keywordClusters, siteUrl } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return insightPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = insightPosts.find((item) => item.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/insights/${post.slug}/`
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: `${siteUrl}/insights/${post.slug}/`,
      images: [{ url: brand.image, alt: post.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [brand.image]
    }
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const post = insightPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@id': `${siteUrl}/#person`
    },
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    mainEntityOfPage: `${siteUrl}/insights/${post.slug}/`,
    image: brand.image,
    keywords: post.keywords
  };

  return (
    <>
      <JsonLd data={schema} />
      <article className="container pt-32 pb-20">
        <div className="glass rounded-[2rem] p-8 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">Deepanshu Ventures insight</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">{post.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{post.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="card rounded-[2rem] p-8">
            <h2 className="text-3xl font-black text-white">Executive summary</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Deepanshu Ventures builds authority by making the brand entity clear: Deepanshu is the founder, Deepanshu Ventures is
              the official company, and the business operates across AI automation, digital growth, startup systems, technology,
              innovation, Gurgaon, and India.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Search engines reward clarity. This content strategy uses canonical pages, schema markup, local signals, FAQ answers,
              founder references, and internal links so branded searches can resolve to one strong official destination.
            </p>

            <h2 className="mt-10 text-3xl font-black text-white">Ranking strategy</h2>
            <ul className="mt-6 grid gap-4">
              {[
                'Create exact-match branded pages for Deepanshu, Deepanshu Ventures, AI, digital, Gurgaon, and innovation intent.',
                'Use Organization, Person, Website, FAQ, Article, and Breadcrumb schema to connect entities.',
                'Answer direct search questions in concise sections for featured snippets and AI search summaries.',
                'Strengthen E-E-A-T with founder identity, official contact details, social profiles, and clear service scope.',
                'Keep the page fast, semantic, mobile-first, and easy for crawlers to parse.'
              ].map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7 text-slate-300">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-200" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="glass rounded-[2rem] p-6">
            <h2 className="text-xl font-black text-white">Related clusters</h2>
            <div className="mt-5 grid gap-4">
              {keywordClusters.slice(0, 4).map((cluster) => (
                <div key={cluster.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-black text-white">{cluster.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{cluster.terms.join(', ')}</p>
                </div>
              ))}
            </div>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-200">
              Homepage <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
