import type { Metadata } from 'next';
import { PaymentsAdminClient } from './payments-admin-client';

export const metadata: Metadata = {
  title: 'Payments Admin',
  description: 'Internal Deepanshu Ventures payment attempt dashboard.',
  robots: {
    index: false,
    follow: false
  }
};

export default function PaymentsAdminPage() {
  return <PaymentsAdminClient />;
}
