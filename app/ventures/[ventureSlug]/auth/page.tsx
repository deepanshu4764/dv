import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OtpAuthPortal } from '@/components/auth/OtpAuthPortal';
import { getVentureAuthConfig, ventureAuthConfigs } from '@/lib/venture-auth';

type PageProps = {
  params: Promise<{ ventureSlug: string }>;
};

export function generateStaticParams() {
  return ventureAuthConfigs.map((venture) => ({ ventureSlug: venture.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ventureSlug } = await params;
  const venture = getVentureAuthConfig(ventureSlug);
  if (!venture) return {};

  return {
    title: `${venture.shortName} Login`,
    description: venture.authDescription,
    alternates: {
      canonical: venture.authHref
    },
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function VentureAuthPage({ params }: PageProps) {
  const { ventureSlug } = await params;
  const venture = getVentureAuthConfig(ventureSlug);
  if (!venture) notFound();

  return <OtpAuthPortal venture={venture} />;
}
