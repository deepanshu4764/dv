import type { Metadata } from 'next';
import { AuthDashboard } from '@/components/auth/AuthDashboard';

export const metadata: Metadata = {
  title: 'Rider Dashboard',
  description: 'Rider dashboard for Deepanshu Ventures authenticated users.',
  robots: {
    index: false,
    follow: false
  }
};

export default function RiderPage() {
  return <AuthDashboard role="rider" />;
}
