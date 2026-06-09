import type { Metadata } from 'next';
import { AuthDashboard } from '@/components/auth/AuthDashboard';

export const metadata: Metadata = {
  title: 'Customer Dashboard',
  description: 'Customer dashboard for Deepanshu Ventures authenticated users.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CustomerPage() {
  return <AuthDashboard role="customer" />;
}
