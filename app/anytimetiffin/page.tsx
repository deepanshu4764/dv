import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BellPlus,
  ChefHat,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Utensils
} from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { brand, siteUrl } from '@/lib/site';

const orderAppPath = '/anytimetiffin-order/';
const whatsappUrl =
  'https://wa.me/918950378717?text=Hi%20AnyTime%20Tiffin%2C%20I%20want%20to%20order%20homemade%20tiffin%20at%20M3M%20Soulitude.';

const menuItems = [
  {
    name: 'Standard Home Tiffin',
    price: 'Rs. 129',
    detail: 'Dal, veg sabzi, rice, salad, and 4 plain rotis.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Premium Home Tiffin',
    price: 'Rs. 169',
    detail: 'Paneer sabzi, dal, rice, salad, and 5 butter rotis.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80'
  }
];

const proof = [
  { icon: Home, title: 'Built for M3M Soulitude', text: 'Focused delivery area for reliable lunch and dinner coordination.' },
  { icon: MessageCircle, title: 'WhatsApp checkout', text: 'Residents can review meals and confirm orders through WhatsApp.' },
  { icon: BellPlus, title: 'Menu alerts', text: 'Updates, pincode checks, and preferences are captured for better operations.' },
  { icon: BadgeCheck, title: 'DV venture system', text: 'Part of the Deepanshu Ventures portfolio and startup execution layer.' }
];

export const metadata: Metadata = {
  title: 'AnyTimeTiffin by Deepanshu Ventures | Homemade Tiffin in M3M Soulitude',
  description:
    'AnyTimeTiffin is a Deepanshu Ventures food venture for homemade tiffin delivery in M3M Soulitude, Sector 89 with WhatsApp ordering, menu alerts, and subscriptions.',
  alternates: {
    canonical: '/anytimetiffin/'
  },
  openGraph: {
    type: 'website',
    title: 'AnyTimeTiffin by Deepanshu Ventures',
    description:
      'Homemade tiffin delivery venture for M3M Soulitude residents, built under Deepanshu Ventures.',
    url: `${siteUrl}/anytimetiffin/`,
    images: [
      {
        url: menuItems[0].image,
        width: 1200,
        height: 630,
        alt: 'AnyTimeTiffin homemade Indian tiffin meal'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyTimeTiffin by Deepanshu Ventures',
    description: 'Homemade tiffin delivery for M3M Soulitude, Sector 89.',
    images: [menuItems[0].image]
  }
};

export default function AnyTimeTiffinPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'FoodEstablishment',
      '@id': `${siteUrl}/anytimetiffin/#business`,
      name: 'AnyTimeTiffin',
      alternateName: 'AnyTime Tiffin by Deepanshu Ventures',
      url: `${siteUrl}/anytimetiffin/`,
      image: menuItems[0].image,
      description:
        'Homemade tiffin delivery for M3M Soulitude, Sector 89 with daily meals, subscriptions, and WhatsApp checkout.',
      founder: {
        '@id': `${siteUrl}/#person`
      },
      parentOrganization: {
        '@id': `${siteUrl}/#organization`
      },
      servesCuisine: ['Indian', 'Homemade food', 'Vegetarian tiffin'],
      priceRange: 'Rs. 129 - Rs. 169',
      areaServed: ['M3M Soulitude', 'Sector 89', 'Gurgaon', 'Gurugram'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: brand.phone,
        contactType: 'orders and customer support',
        availableLanguage: ['English', 'Hindi']
      },
      hasMenu: `${siteUrl}/anytimetiffin/#menu`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Deepanshu Ventures', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'AnyTimeTiffin', item: `${siteUrl}/anytimetiffin/` }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={schema} />
      <section className="noise relative overflow-hidden pt-28 sm:pt-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />
        <div className="container grid min-h-[calc(100svh-7rem)] items-center gap-10 pb-16 lg:grid-cols-[1fr_0.92fr]">
          <div>
            <Link
              href="/ventures/"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-black text-orange-100"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Deepanshu Ventures food venture
            </Link>
            <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-7xl">
              AnyTimeTiffin: homemade meals for M3M Soulitude residents.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A local food venture by Deepanshu Ventures, built for fresh daily tiffins, WhatsApp ordering, resident menu
              alerts, and reliable lunch and dinner coordination inside M3M Soulitude, Sector 89.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={orderAppPath}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-black text-midnight transition hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Open full order app <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-6 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                Order on WhatsApp <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
            <dl className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['Rs. 129', 'Starting tiffin price'],
                ['122004', 'Primary pincode'],
                ['Lunch + Dinner', 'Daily order windows']
              ].map(([value, label]) => (
                <div key={value} className="glass rounded-2xl p-5">
                  <dt className="text-2xl font-black text-white">{value}</dt>
                  <dd className="mt-2 text-sm leading-6 text-slate-400">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-orange-400/18 blur-3xl" aria-hidden="true" />
            <div className="glass relative overflow-hidden rounded-[2rem] p-4">
              <Image
                src={menuItems[0].image}
                alt="AnyTimeTiffin homemade Indian tiffin meal"
                width={900}
                height={1080}
                priority
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              />
              <div className="absolute inset-x-8 bottom-8 rounded-3xl border border-white/12 bg-midnight/78 p-6 backdrop-blur-2xl">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-100">Now serving</p>
                <h2 className="mt-2 text-3xl font-black text-white">M3M Soulitude, Sector 89</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Fresh home-style lunch and dinner orders via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10" aria-labelledby="venture-answer">
        <div className="glass rounded-[2rem] p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-100">Featured answer target</p>
          <h2 id="venture-answer" className="mt-3 text-2xl font-black text-white sm:text-3xl">
            What is AnyTimeTiffin?
          </h2>
          <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-300">
            AnyTimeTiffin is a Deepanshu Ventures local food venture that helps M3M Soulitude residents order fresh homemade
            Indian tiffins, subscriptions, and menu updates through a fast web and WhatsApp ordering flow.
          </p>
        </div>
      </section>

      <section className="container pb-8 pt-20" id="menu">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-100">Menu highlights</p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_0.75fr] lg:items-end">
          <h2 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">Simple meals, fast ordering.</h2>
          <p className="text-lg leading-8 text-slate-400">
            The full AnyTimeTiffin app includes cart review, add-ons, coupons, subscription plans, pincode checks, and order capture.
          </p>
        </div>
      </section>

      <section className="container grid gap-5 md:grid-cols-2">
        {menuItems.map((item) => (
          <article key={item.name} className="card overflow-hidden rounded-[2rem]">
            <Image src={item.image} alt={item.name} width={900} height={520} className="aspect-[16/9] w-full object-cover" />
            <div className="p-7">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-midnight">{item.price}</span>
              <h3 className="mt-5 text-2xl font-black text-white">{item.name}</h3>
              <p className="mt-3 text-base leading-8 text-slate-300">{item.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="container grid gap-5 py-20 md:grid-cols-2 lg:grid-cols-4">
        {proof.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="card rounded-3xl p-6">
              <Icon className="h-8 w-8 text-orange-100" aria-hidden="true" />
              <h3 className="mt-6 text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="container pb-20" id="order">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="glass rounded-[2rem] p-8">
            <MapPin className="h-10 w-10 text-orange-100" aria-hidden="true" />
            <h2 className="mt-6 text-4xl font-black leading-tight text-white">Local venture, narrow service promise.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              AnyTimeTiffin is intentionally focused on M3M Soulitude first. That makes delivery coordination, resident updates,
              and meal reliability stronger than a generic food listing.
            </p>
          </div>
          <div className="card rounded-[2rem] p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-100">Launch actions</p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white">Order, subscribe, or ask for today&apos;s menu.</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link href={orderAppPath} className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-midnight transition hover:-translate-y-0.5 hover:bg-orange-50">
                Full order app <Utensils className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-5 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12">
                WhatsApp <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href={`${orderAppPath}#plans`} className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-5 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12">
                Subscriptions <Clock className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="/ventures/" className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-5 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12">
                DV portfolio <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <ChefHat className="h-6 w-6 text-orange-100" aria-hidden="true" />
                <p className="font-black text-white">Built as a Deepanshu Ventures operating experiment.</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                The venture connects local demand, lead capture, menu updates, subscriptions, and WhatsApp conversion in one practical web system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
