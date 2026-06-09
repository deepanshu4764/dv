import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  Clock,
  Globe2,
  Lightbulb,
  LineChart,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { ventureAuthConfigs } from '@/lib/venture-auth';

export const siteUrl = 'https://www.deepanshuventures.com';

export const googleSheetsEndpoint =
  'https://script.google.com/macros/s/AKfycbwgrYN0lNiJWxhsBtjnHqXK0cT3WNRvEnAo_LizJ04ih-UUPLvY-ykUKSk-9kw_7f6A/exec';

export const calendlyUrl = 'https://calendly.com/deepanshucommerce/30min';

export const brand = {
  name: 'Deepanshu Ventures',
  legalName: 'Deepanshu Ventures',
  founder: 'Deepanshu',
  founderFullName: 'Deepanshu Yadav',
  email: 'deepanshucommerce@gmail.com',
  hiringEmail: 'hiring@deepanshuventures.com',
  phone: '+91 8950378717',
  whatsapp: 'https://wa.me/918950378717?text=Hey%20Deepanshu%2C%20I%20want%20to%20work%20with%20Deepanshu%20Ventures',
  image: 'https://i.ibb.co/tPK8BHgJ/my-photo.jpg',
  social: {
    linkedin: 'https://www.linkedin.com/in/earthiandeepanshu',
    instagram: 'https://www.instagram.com/itsdeepanshu2005',
    x: 'https://x.com/itsdeepansh2005',
    youtube: 'https://youtube.com/@itsdeepanshu2005',
    facebook: 'https://www.facebook.com/share/1BvfdjTw2z/?mibextid=wwXIfr'
  }
};

export const seoKeywords = [
  'Deepanshu',
  'Deepanshu Ventures',
  'Deepanshu company',
  'Deepanshu business',
  'Deepanshu entrepreneur',
  'Deepanshu founder',
  'Deepanshu startup',
  'Deepanshu official',
  'Deepanshu ventures official',
  'Deepanshu ventures India',
  'Deepanshu ventures Gurgaon',
  'Deepanshu ventures AI',
  'Deepanshu ventures technology',
  'Deepanshu ventures digital',
  'Deepanshu ventures innovation',
  'AI automation company India',
  'digital growth company Gurgaon',
  'founder branding India',
  'startup venture studio India'
];

export const navLinks = [
  { label: 'Company', href: '/deepanshu-ventures/' },
  { label: 'Founder', href: '/deepanshu/' },
  { label: 'Ventures', href: '/#ventures' },
  { label: 'Pay', href: '/pay/' },
  { label: 'AI', href: '/ai-automation/' },
  { label: 'Gurgaon', href: '/gurgaon/' },
  { label: 'Insights', href: '/insights/deepanshu-ventures-seo-strategy/' },
  { label: 'Contact', href: '#contact' }
];

export const heroStats = [
  { value: 'India', label: 'Founder-led venture studio' },
  { value: 'AI + Web', label: 'Automation, technology, digital growth' },
  { value: '24h', label: 'Typical response window for serious inquiries' }
];

export const capabilities = [
  {
    icon: Rocket,
    title: 'Founder Brand Operating System',
    description:
      'Personal brand architecture for founders, entrepreneurs, and operators who want authority, discoverability, and conversion.',
    keywords: 'Deepanshu founder, Deepanshu entrepreneur, founder branding India'
  },
  {
    icon: Bot,
    title: 'AI Automation & Workflow Systems',
    description:
      'Lean AI systems for lead capture, support, CRM workflows, WhatsApp routing, and operational automation.',
    keywords: 'Deepanshu ventures AI, Deepanshu ventures technology, AI automation Gurgaon'
  },
  {
    icon: LineChart,
    title: 'Digital Growth & Performance Marketing',
    description:
      'Content strategy, paid growth, social media systems, analytics, and conversion loops for modern businesses.',
    keywords: 'Deepanshu ventures digital, Deepanshu business, Deepanshu company'
  },
  {
    icon: Building2,
    title: 'Venture Building & Startup Launches',
    description:
      'Business ideation, web experiences, local commerce launches, and practical startup execution under one brand system.',
    keywords: 'Deepanshu startup, Deepanshu ventures innovation, venture studio India'
  }
];

export const trustSignals = [
  { icon: ShieldCheck, title: 'Official brand presence', description: 'Clear canonical website, social links, business identity, and structured schema.' },
  { icon: Globe2, title: 'India and Gurgaon relevance', description: 'Local SEO architecture for India, Gurgaon, Gurugram, Delhi-NCR, and remote markets.' },
  { icon: BrainCircuit, title: 'AI-search ready', description: 'Semantic content blocks, FAQ snippets, direct answers, and entity-rich copy for AI search.' },
  { icon: Clock, title: 'Fast static delivery', description: 'Next.js App Router, optimized metadata, responsive CSS, and minimal client JavaScript.' }
];

export const ventures = ventureAuthConfigs.map((venture) => ({
  title: venture.name,
  href: venture.href,
  appHref: venture.appHref,
  authHref: venture.authHref,
  description: venture.description,
  tag: venture.tag
}));

export const paymentLinks = [
  {
    title: 'AI Automation Agency advance',
    href: '/pay/?venture=ai-automation-agency&amount=15000&purpose=ai-automation-starter-advance',
    description: 'Pay a consultation, starter package, package advance, or custom AI automation invoice.'
  },
  {
    title: 'Social Drive package payment',
    href: '/pay/?venture=social-drive-marketing-agency&amount=15000&purpose=social-drive-base-plan',
    description: 'Pay for strategy booking, monthly packages, campaign advances, or custom marketing invoices.'
  },
  {
    title: 'AnyTimeTiffin payment',
    href: '/ventures/anytime-tiffin/',
    description: 'Open the live tiffin order app and pay the exact cart total after selecting meals.'
  },
  {
    title: 'Custom Deepanshu Ventures payment',
    href: '/pay/?venture=deepanshu-ventures',
    description: 'Create a custom Razorpay payment for invoices, retainers, consultation, or venture support.'
  }
];

export const faqs = [
  {
    question: 'What is Deepanshu Ventures?',
    answer:
      'Deepanshu Ventures is the official founder-led brand and venture studio of Deepanshu. It focuses on AI automation, digital growth, websites, founder branding, startup systems, and practical business innovation in India.'
  },
  {
    question: 'Who is Deepanshu?',
    answer:
      'Deepanshu is an Indian entrepreneur and founder building Deepanshu Ventures as a modern company for technology, AI automation, digital business growth, and venture execution.'
  },
  {
    question: 'Is this the official Deepanshu Ventures website?',
    answer:
      'Yes. Deepanshuventures.com is structured as the official website for Deepanshu Ventures, with canonical metadata, schema markup, sitemap, robots.txt, social links, and brand contact details.'
  },
  {
    question: 'Does Deepanshu Ventures work in Gurgaon and India?',
    answer:
      'Yes. Deepanshu Ventures is built for India, with local relevance for Gurgaon, Gurugram, Delhi-NCR, Rohtak, and remote businesses across the country.'
  },
  {
    question: 'What services does Deepanshu Ventures provide?',
    answer:
      'Deepanshu Ventures provides founder branding, AI automation, website and funnel creation, social media strategy, performance marketing, business systems, and startup growth support.'
  },
  {
    question: 'How can I contact Deepanshu Ventures?',
    answer:
      'You can contact Deepanshu Ventures through the website lead form, WhatsApp, email at deepanshucommerce@gmail.com, or book a meeting for hiring and internship discussions through the Calendly link.'
  }
];

export const keywordClusters = [
  {
    title: 'Branded Search',
    terms: ['Deepanshu', 'Deepanshu official', 'Deepanshu Ventures', 'Deepanshu Ventures official']
  },
  {
    title: 'Founder & Company Intent',
    terms: ['Deepanshu founder', 'Deepanshu entrepreneur', 'Deepanshu company', 'Deepanshu business']
  },
  {
    title: 'Startup & Innovation',
    terms: ['Deepanshu startup', 'Deepanshu ventures innovation', 'venture studio India', 'startup systems India']
  },
  {
    title: 'AI & Technology',
    terms: ['Deepanshu ventures AI', 'Deepanshu ventures technology', 'AI automation India', 'AI automation Gurgaon']
  },
  {
    title: 'Digital & Local SEO',
    terms: ['Deepanshu ventures digital', 'Deepanshu ventures India', 'Deepanshu ventures Gurgaon', 'digital growth Gurgaon']
  }
];

export const insightPosts = [
  {
    slug: 'deepanshu-ventures-seo-strategy',
    title: 'Deepanshu Ventures SEO Strategy: Building Branded Search Authority',
    description:
      'How Deepanshu Ventures structures branded SEO, entity signals, founder authority, and internal links for long-term search visibility.',
    keywords: ['Deepanshu Ventures SEO', 'Deepanshu official', 'Deepanshu Ventures official'],
    date: '2026-06-06'
  },
  {
    slug: 'deepanshu-founder-branding-india',
    title: 'Deepanshu Founder Branding in India: Authority, Trust, and Digital Presence',
    description:
      'A founder-branding framework for Indian entrepreneurs who want stronger Google visibility and higher trust.',
    keywords: ['Deepanshu founder', 'Deepanshu entrepreneur', 'founder branding India'],
    date: '2026-06-06'
  },
  {
    slug: 'ai-automation-gurgaon-businesses',
    title: 'AI Automation for Gurgaon Businesses: A Practical Deepanshu Ventures Playbook',
    description:
      'A practical guide to AI automation, lead routing, and digital workflow systems for Gurgaon and India-based businesses.',
    keywords: ['Deepanshu ventures AI', 'AI automation Gurgaon', 'Deepanshu ventures technology'],
    date: '2026-06-06'
  }
];

export const seoPages = [
  {
    slug: 'deepanshu',
    title: 'Deepanshu Official | Founder of Deepanshu Ventures',
    h1: 'Deepanshu official founder profile',
    description:
      'Official profile for Deepanshu, founder of Deepanshu Ventures, an Indian entrepreneur building AI, technology, digital growth, and startup systems.',
    focus: 'Deepanshu, Deepanshu founder, Deepanshu entrepreneur, Deepanshu official',
    icon: Users
  },
  {
    slug: 'deepanshu-ventures',
    title: 'Deepanshu Ventures Official | Company, Business & Startup Studio',
    h1: 'Deepanshu Ventures official company page',
    description:
      'Deepanshu Ventures is a founder-led company and startup studio focused on AI automation, digital growth, technology, innovation, and business systems in India.',
    focus: 'Deepanshu Ventures, Deepanshu company, Deepanshu business, Deepanshu startup',
    icon: Building2
  },
  {
    slug: 'ai-automation',
    title: 'Deepanshu Ventures AI | Automation & Technology Systems',
    h1: 'Deepanshu Ventures AI and automation systems',
    description:
      'AI automation, business technology, digital workflows, lead capture, and operational systems by Deepanshu Ventures in India.',
    focus: 'Deepanshu ventures AI, Deepanshu ventures technology, AI automation India',
    icon: BrainCircuit
  },
  {
    slug: 'digital-growth',
    title: 'Deepanshu Ventures Digital | Growth, Websites & Marketing Systems',
    h1: 'Deepanshu Ventures digital growth systems',
    description:
      'Digital growth, websites, funnels, social media, performance marketing, and brand systems for companies and founders.',
    focus: 'Deepanshu ventures digital, Deepanshu business, Deepanshu company',
    icon: ChartNoAxesCombined
  },
  {
    slug: 'gurgaon',
    title: 'Deepanshu Ventures Gurgaon | AI, Digital & Startup Support',
    h1: 'Deepanshu Ventures Gurgaon and India presence',
    description:
      'Local Deepanshu Ventures SEO and service page for Gurgaon, Gurugram, Delhi-NCR, Rohtak, and businesses across India.',
    focus: 'Deepanshu ventures Gurgaon, Deepanshu ventures India, Deepanshu ventures Gurugram',
    icon: MapPin
  },
  {
    slug: 'innovation',
    title: 'Deepanshu Ventures Innovation | Startup Ideas & Future Business Systems',
    h1: 'Deepanshu Ventures innovation and startup systems',
    description:
      'Innovation, startup strategy, AI workflows, digital products, and practical business experiments under Deepanshu Ventures.',
    focus: 'Deepanshu ventures innovation, Deepanshu startup, Deepanshu entrepreneur',
    icon: Lightbulb
  }
];

export const featuredAnswer = {
  title: 'What does Deepanshu Ventures do?',
  answer:
    'Deepanshu Ventures is the official founder-led company of Deepanshu, built for AI automation, digital growth, founder branding, websites, startup systems, and business innovation in India.'
};

export const socialLinks = [
  { label: 'LinkedIn', href: brand.social.linkedin },
  { label: 'Instagram', href: brand.social.instagram },
  { label: 'X', href: brand.social.x },
  { label: 'YouTube', href: brand.social.youtube },
  { label: 'Facebook', href: brand.social.facebook },
  { label: 'WhatsApp', href: brand.whatsapp }
];

export const ctaLinks = [
  { label: 'Build with Deepanshu Ventures', href: '#contact', icon: ArrowUpRight },
  { label: 'Book hiring meeting', href: calendlyUrl, icon: Sparkles }
];
