import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Venture Rider Access',
  description: 'Rider access is now scoped to each Deepanshu Ventures portfolio company.',
  robots: {
    index: false,
    follow: false
  }
};

export default function RiderPage() {
  redirect('/ventures/');
}
