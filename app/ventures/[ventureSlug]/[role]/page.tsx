import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthDashboard } from '@/components/auth/AuthDashboard';
import {
  getVentureAuthConfig,
  getVentureDashboardHref,
  ventureAuthConfigs,
  ventureRoles,
  type UserRole
} from '@/lib/venture-auth';

type PageProps = {
  params: Promise<{ ventureSlug: string; role: string }>;
};

function isUserRole(role: string): role is UserRole {
  return role === 'customer' || role === 'rider';
}

export function generateStaticParams() {
  return ventureAuthConfigs.flatMap((venture) => ventureRoles.map((role) => ({ ventureSlug: venture.slug, role })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ventureSlug, role } = await params;
  const venture = getVentureAuthConfig(ventureSlug);
  if (!venture || !isUserRole(role)) return {};

  return {
    title: `${venture.shortName} ${role === 'customer' ? 'Customer' : 'Rider'} Dashboard`,
    description: role === 'customer' ? venture.customerDashboardDescription : venture.riderDashboardDescription,
    alternates: {
      canonical: getVentureDashboardHref(venture, role)
    },
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function VentureRoleDashboardPage({ params }: PageProps) {
  const { ventureSlug, role } = await params;
  const venture = getVentureAuthConfig(ventureSlug);
  if (!venture || !isUserRole(role)) notFound();

  return <AuthDashboard venture={venture} role={role} />;
}
