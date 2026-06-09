import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Venture Customer Access',
  description: 'Customer access is now scoped to each Deepanshu Ventures portfolio company.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CustomerPage() {
  redirect('/ventures/');
}
