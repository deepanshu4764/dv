import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { SeoLandingPage } from '@/components/SeoLandingPage';
import { brand, seoPages, siteUrl } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = seoPages.find((item) => item.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.focus.split(',').map((keyword) => keyword.trim()),
    alternates: {
      canonical: `/${page.slug}/`
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteUrl}/${page.slug}/`,
      images: [{ url: brand.image, alt: page.h1 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [brand.image]
    }
  };
}

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = seoPages.find((item) => item.slug === slug);
  if (!page) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    headline: page.h1,
    description: page.description,
    url: `${siteUrl}/${page.slug}/`,
    about: page.focus,
    isPartOf: {
      '@id': `${siteUrl}/#website`
    },
    publisher: {
      '@id': `${siteUrl}/#organization`
    }
  };

  return (
    <>
      <JsonLd data={schema} />
      <SeoLandingPage page={page} />
    </>
  );
}
