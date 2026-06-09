import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Venture Login',
  description: 'Choose a Deepanshu Ventures portfolio company to access its venture-specific login.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthPage() {
  redirect('/ventures/');
}
