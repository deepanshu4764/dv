import type { Metadata } from 'next';
import { OtpAuthPortal } from '@/components/auth/OtpAuthPortal';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Phone OTP login and sign-up portal for Deepanshu Ventures customers and riders.',
  alternates: {
    canonical: '/auth/'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthPage() {
  return <OtpAuthPortal />;
}
