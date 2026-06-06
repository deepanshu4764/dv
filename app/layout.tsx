import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { brand, faqs, seoKeywords, siteUrl } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true
});

const title = 'Deepanshu Ventures Official | AI, Technology, Digital Growth & Founder Brand';
const description =
  'Official website of Deepanshu Ventures: founder-led AI automation, technology, digital growth, startup systems, innovation, and business building in India and Gurgaon.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | Deepanshu Ventures'
  },
  description,
  applicationName: 'Deepanshu Ventures',
  keywords: seoKeywords,
  authors: [{ name: brand.founderFullName, url: siteUrl }],
  creator: brand.founderFullName,
  publisher: brand.name,
  alternates: {
    canonical: '/'
  },
  category: 'Technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: brand.name,
    title,
    description,
    images: [
      {
        url: brand.image,
        width: 1200,
        height: 630,
        alt: 'Deepanshu Ventures official founder brand'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [brand.image],
    creator: '@itsdeepansh2005'
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050816'
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: brand.name,
  legalName: brand.legalName,
  url: siteUrl,
  logo: `${siteUrl}/favicon.png`,
  image: brand.image,
  description,
  founder: {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: brand.founderFullName,
    alternateName: brand.founder,
    jobTitle: 'Founder',
    url: siteUrl,
    image: brand.image,
    sameAs: Object.values(brand.social)
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'business inquiries',
      telephone: brand.phone,
      email: brand.email,
      areaServed: ['IN', 'Gurgaon', 'Gurugram', 'Delhi-NCR'],
      availableLanguage: ['English', 'Hindi']
    }
  ],
  sameAs: Object.values(brand.social),
  areaServed: ['India', 'Gurgaon', 'Gurugram', 'Delhi-NCR', 'Rohtak'],
  knowsAbout: seoKeywords
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: brand.name,
  alternateName: ['Deepanshu official', 'Deepanshu Ventures official', 'Deepanshu company'],
  publisher: {
    '@id': `${siteUrl}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/?s={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <JsonLd data={[organizationSchema, websiteSchema, faqSchema]} />
      </body>
    </html>
  );
}
