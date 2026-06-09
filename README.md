# Deepanshu Ventures

Official SEO-first website for **Deepanshu Ventures**, built with Next.js, TypeScript, Tailwind CSS, structured schema, internal SEO pages, and Vercel-ready deployment.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion dependency available for interaction layers
- Static generation and metadata-driven SEO

## Local Development

```bash
npm install
npm run dev
```

Visit:

```txt
http://127.0.0.1:3000/
```

## Production Build

```bash
npm run build
npm start
```

## SEO Architecture

Primary SEO files:

- `app/layout.tsx` - global metadata, OpenGraph, Twitter, Organization, Person, Website, and FAQ schema
- `app/sitemap.ts` - generated XML sitemap
- `app/robots.ts` - generated robots.txt
- `app/[slug]/page.tsx` - branded SEO landing pages
- `app/insights/[slug]/page.tsx` - authority-building SEO articles
- `SEO_ARCHITECTURE.md` - keyword strategy and deployment checklist

## Core Routes

- `/`
- `/deepanshu/`
- `/deepanshu-ventures/`
- `/ai-automation/`
- `/digital-growth/`
- `/gurgaon/`
- `/innovation/`
- `/ventures/`
- `/ventures/ai-automation-agency/`
- `/ventures/social-drive-marketing-agency/`
- `/ventures/anytime-tiffin/`
- `/pay/`
- `/payments/admin/`
- `/ventures/ai-automation-agency/auth/`
- `/ventures/social-drive-marketing-agency/auth/`
- `/ventures/anytime-tiffin/auth/`
- `/ventures/[venture]/customer/`
- `/ventures/[venture]/rider/`
- `/ai-automation-agency/index.html`
- `/social-drive/index.html`
- `/anytimetiffin/`
- `/anytimetiffin-order/`
- `/insights/deepanshu-ventures-seo-strategy/`
- `/insights/deepanshu-founder-branding-india/`
- `/insights/ai-automation-gurgaon-businesses/`

## Deployment

Deploy from the repository root on Vercel. Vercel detects Next.js automatically.

## Razorpay Payments

Payment architecture is documented in `RAZORPAY_INTEGRATION.md`. Add the Razorpay environment variables from `.env.example` in Vercel before testing live payments.

After deployment:

1. Submit `https://www.deepanshuventures.com/sitemap.xml` in Google Search Console.
2. Inspect the homepage and all branded SEO pages.
3. Link official social/business profiles back to the website.
4. Keep adding founder, AI, Gurgaon, startup, and innovation content to build topical authority.
