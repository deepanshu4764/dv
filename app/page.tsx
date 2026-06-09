import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CreditCard, LogIn, MapPin, Search, Sparkles } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { LeadForm } from '@/components/LeadForm';
import { MotionReveal } from '@/components/MotionReveal';
import {
  brand,
  calendlyUrl,
  capabilities,
  ctaLinks,
  faqs,
  featuredAnswer,
  heroStats,
  insightPosts,
  keywordClusters,
  paymentLinks,
  seoPages,
  siteUrl,
  trustSignals,
  ventures
} from '@/lib/site';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Deepanshu Ventures Official',
      item: siteUrl
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <section className="noise relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />
        <div className="container grid min-h-[calc(100svh-7rem)] items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-black text-blue-100 shadow-glow">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Official Deepanshu Ventures website
              </div>
              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-7xl lg:text-8xl">
                Deepanshu Ventures: AI, digital growth, technology and startup innovation.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Deepanshu Ventures is the official founder-led company of Deepanshu, built for AI automation, digital business
                systems, premium websites, founder branding, and startup execution across India and Gurgaon.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {ctaLinks.map((cta, index) => {
                  const Icon = cta.icon;
                  const external = cta.href.startsWith('https://');
                  return (
                    <Link
                      key={cta.href}
                      href={cta.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition hover:-translate-y-0.5 ${
                        index === 0 ? 'bg-white text-midnight hover:bg-blue-50' : 'border border-white/14 bg-white/8 text-white hover:bg-white/12'
                      }`}
                    >
                      {cta.label}
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
              <dl className="mt-10 grid gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.value} className="glass rounded-2xl p-5">
                    <dt className="text-2xl font-black text-white">{stat.value}</dt>
                    <dd className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</dd>
                  </div>
                ))}
              </dl>
          </div>

          <div className="relative min-w-0">
              <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" aria-hidden="true" />
              <div className="glass relative overflow-hidden rounded-[2rem] p-4">
                <Image
                  src={brand.image}
                  alt="Deepanshu, founder of Deepanshu Ventures"
                  width={900}
                  height={1080}
                  priority
                  className="aspect-[4/5] w-full rounded-[1.5rem] object-cover object-top"
                />
                <div className="absolute inset-x-8 bottom-8 rounded-3xl border border-white/12 bg-midnight/76 p-6 backdrop-blur-2xl">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-200">Founder</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{brand.founderFullName}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Entrepreneur building Deepanshu Ventures for AI, technology, digital growth, and innovation in India.
                  </p>
                </div>
              </div>
          </div>
        </div>
      </section>

      <section className="container py-10" aria-labelledby="featured-answer">
        <div className="glass rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">Featured answer target</p>
              <h2 id="featured-answer" className="mt-3 text-2xl font-black text-white sm:text-3xl">
                {featuredAnswer.title}
              </h2>
              <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-300">{featuredAnswer.answer}</p>
            </div>
            <Search className="h-10 w-10 shrink-0 text-blue-200" aria-hidden="true" />
          </div>
        </div>
      </section>

      <SectionHeader
        eyebrow="Authority architecture"
        title="Built for branded search domination."
        description="The website is structured around entity clarity, internal links, local relevance, FAQ snippets, and direct-answer blocks for Google, AI search, and voice search."
      />

      <section className="container grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {trustSignals.map((signal, index) => {
          const Icon = signal.icon;
          return (
            <MotionReveal key={signal.title} delay={index * 0.04}>
              <article className="card h-full rounded-3xl p-6">
                <Icon className="h-8 w-8 text-blue-200" aria-hidden="true" />
                <h3 className="mt-6 text-xl font-black text-white">{signal.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{signal.description}</p>
              </article>
            </MotionReveal>
          );
        })}
      </section>

      <SectionHeader
        id="services"
        eyebrow="Services"
        title="Premium systems for founders, companies and startups."
        description="Deepanshu Ventures combines strategy and implementation across AI automation, digital growth, websites, founder branding and venture building."
      />

      <section className="container grid gap-5 md:grid-cols-2">
        {capabilities.map((capability, index) => {
          const Icon = capability.icon;
          return (
            <MotionReveal key={capability.title} delay={index * 0.05}>
              <article className="card group h-full rounded-[2rem] p-7 transition hover:-translate-y-1 hover:border-blue-300/40">
                <div className="flex items-start justify-between gap-6">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-midnight">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-black text-white">{capability.title}</h3>
                <p className="mt-4 text-base leading-8 text-slate-300">{capability.description}</p>
                <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold leading-7 text-blue-100">
                  SEO focus: {capability.keywords}
                </p>
              </article>
            </MotionReveal>
          );
        })}
      </section>

      <SectionHeader
        id="company"
        eyebrow="Company pages"
        title="Internal links built around Deepanshu search intent."
        description="Each page targets a specific keyword cluster so the website can build topical authority around the Deepanshu entity."
      />

      <section className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {seoPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.slug} href={`/${page.slug}/`} className="card focus-ring group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-blue-300/40">
              <Icon className="h-8 w-8 text-blue-200" aria-hidden="true" />
              <h3 className="mt-6 text-xl font-black text-white">{page.h1}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{page.description}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-200">
                Open SEO page <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </p>
            </Link>
          );
        })}
      </section>

      <section className="container py-20" id="local-seo">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rounded-[2rem] p-8">
            <MapPin className="h-10 w-10 text-blue-200" aria-hidden="true" />
            <h2 className="mt-6 text-4xl font-black leading-tight text-white">Deepanshu Ventures India and Gurgaon presence</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Deepanshu Ventures is positioned for India-wide discoverability with local relevance for Gurgaon, Gurugram,
              Delhi-NCR, Rohtak, and founder-led businesses that want premium AI and digital systems.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Gurgaon / Gurugram', 'Delhi-NCR', 'Rohtak', 'All India'].map((location) => (
              <div key={location} className="card rounded-3xl p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Local SEO target</p>
                <h3 className="mt-4 text-2xl font-black text-white">{location}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Optimized for Deepanshu Ventures business, startup, AI, technology and digital search queries in {location}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-8 pt-20" id="ventures">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">Venture portfolio</p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_0.75fr] lg:items-end">
          <h2 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">Open active Deepanshu Ventures directly.</h2>
          <p className="text-lg leading-8 text-slate-400">
            A simple, mobile-friendly list of venture pages so visitors can move straight into AI automation, social media growth, or the
            Anytime Tiffin ordering experience.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ventures.map((venture) => (
            <article key={venture.href} className="glass rounded-[2rem] p-6 transition hover:-translate-y-1">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-midnight">{venture.tag}</span>
              <h3 className="mt-6 text-2xl font-black text-white">{venture.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{venture.description}</p>
              <div className="mt-6 grid gap-3">
                <Link href={venture.href} className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-midnight transition hover:bg-blue-50">
                  Explore venture <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href={venture.authHref} className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm font-black text-white transition hover:bg-white/12">
                  Venture login <LogIn className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionHeader
        id="payments"
        eyebrow="Secure payments"
        title="Pay for any Deepanshu Ventures service or venture."
        description="Razorpay payment links are routed through one reusable server-verified system for agency packages, consultation booking, advances, custom invoices, and AnyTimeTiffin orders."
      />

      <section className="container grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {paymentLinks.map((payment) => (
          <Link key={payment.href} href={payment.href} className="card focus-ring group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-blue-300/40">
            <CreditCard className="h-8 w-8 text-blue-200" aria-hidden="true" />
            <h3 className="mt-6 text-xl font-black text-white">{payment.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{payment.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-200">
              Open payment <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </p>
          </Link>
        ))}
      </section>

      <SectionHeader
        eyebrow="Keyword clusters"
        title="Semantic SEO map for Deepanshu Ventures."
        description="The page uses keyword clusters naturally instead of stuffing. This supports entity recognition, topical authority, and branded search clarity."
      />

      <section className="container grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {keywordClusters.map((cluster) => (
          <article key={cluster.title} className="card rounded-3xl p-5">
            <h3 className="text-lg font-black text-white">{cluster.title}</h3>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-400">
              {cluster.terms.map((term) => (
                <li key={term} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-200" aria-hidden="true" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <SectionHeader
        id="insights"
        eyebrow="Topical authority"
        title="SEO article strategy and authority content."
        description="These content hubs are designed for branded search, local SEO, AI automation intent, and founder authority."
      />

      <section className="container grid gap-5 md:grid-cols-3">
        {insightPosts.map((post) => (
          <Link key={post.slug} href={`/insights/${post.slug}/`} className="card focus-ring group rounded-3xl p-6 transition hover:-translate-y-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-200">{post.date}</p>
            <h3 className="mt-5 text-xl font-black leading-tight text-white">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">{post.description}</p>
            <p className="mt-5 text-sm font-black text-blue-200">Read strategy article</p>
          </Link>
        ))}
      </section>

      <SectionHeader
        id="faq"
        eyebrow="FAQ snippets"
        title="Direct answers for Google, voice search and AI search."
        description="Structured FAQ content improves clarity for users and helps search engines understand the Deepanshu Ventures entity."
      />

      <section className="container grid gap-4">
        {faqs.map((faq) => (
          <article key={faq.question} className="card rounded-3xl p-6">
            <h3 className="text-xl font-black text-white">{faq.question}</h3>
            <p className="mt-3 text-base leading-8 text-slate-300">{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="container py-20" id="contact">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="glass rounded-[2rem] p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">Contact and conversion</p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white">Work with Deepanshu Ventures.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Send a project inquiry, join the update list, or book a hiring meeting if you want to intern or work with DV companies.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-300">
              <a href={brand.whatsapp} className="transition hover:text-white">
                WhatsApp: {brand.phone}
              </a>
              <a href={`mailto:${brand.email}`} className="transition hover:text-white">
                Email: {brand.email}
              </a>
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                Book 15-minute hiring meeting
              </a>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-black text-white">Join Deepanshu Ventures updates</h3>
              <div className="mt-4">
                <LeadForm eventType="NEWSLETTER_SIGNUP" compact />
              </div>
            </div>
          </div>
          <div className="card rounded-[2rem] p-6 md:p-8">
            <LeadForm eventType="CONTACT_SUBMITTED" />
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  id
}: {
  eyebrow: string;
  title: string;
  description: string;
  id?: string;
}) {
  return (
    <section className="container pb-8 pt-20" id={id}>
      <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">{eyebrow}</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_0.75fr] lg:items-end">
        <h2 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">{title}</h2>
        <p className="text-lg leading-8 text-slate-400">{description}</p>
      </div>
    </section>
  );
}
