# Deepanshu Ventures SEO Architecture

## Primary Ranking Targets

- Deepanshu
- Deepanshu Ventures
- Deepanshu company
- Deepanshu business
- Deepanshu entrepreneur
- Deepanshu founder
- Deepanshu startup
- Deepanshu official
- Deepanshu Ventures official
- Deepanshu Ventures India
- Deepanshu Ventures Gurgaon
- Deepanshu Ventures AI
- Deepanshu Ventures technology
- Deepanshu Ventures digital
- Deepanshu Ventures innovation

## Technical Architecture

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS plus optimized global CSS
- Animations: Framer Motion, limited to progressive reveal effects
- Hosting: Vercel-ready
- SEO files: `app/sitemap.ts`, `app/robots.ts`, `sitemap.xml`, `robots.txt`
- Schema: Organization, Person, WebSite, FAQ, WebPage, Article, CollectionPage, BreadcrumbList
- Canonicals: configured through Next.js metadata
- Lead capture: Google Apps Script endpoint inside `components/LeadForm.tsx`

## Core Pages

- `/` - primary branded entity homepage
- `/deepanshu/` - founder and official Deepanshu search intent
- `/deepanshu-ventures/` - company and business search intent
- `/ai-automation/` - AI and technology search intent
- `/digital-growth/` - digital growth and marketing search intent
- `/gurgaon/` - local SEO for Gurgaon, Gurugram, Delhi-NCR, India
- `/innovation/` - startup and innovation search intent
- `/ventures/` - portfolio and venture surfaces
- `/ventures/ai-automation-agency/` - clean venture redirect to the AI Automation Agency page
- `/ventures/social-drive-marketing-agency/` - clean venture redirect to the Social Drive Marketing Agency page
- `/ventures/anytime-tiffin/` - clean venture redirect to the Anytime Tiffin order app
- `/ai-automation-agency/index.html` - static AI Automation Agency venture page
- `/social-drive/index.html` - static Social Drive Marketing Agency venture page
- `/anytimetiffin/` - AnyTimeTiffin food venture, local tiffin, and M3M Soulitude intent
- `/anytimetiffin-order/` - full ordering app with cart, subscriptions, WhatsApp checkout, and lead capture
- `/insights/deepanshu-ventures-seo-strategy/`
- `/insights/deepanshu-founder-branding-india/`
- `/insights/ai-automation-gurgaon-businesses/`

## Content Strategy

The website uses exact-match branded pages plus semantic supporting content. Each page reinforces the relationship between:

- Deepanshu as founder
- Deepanshu Ventures as the official company
- India and Gurgaon as location signals
- AI, technology, digital growth, startup, innovation, and business as topical clusters

## Deployment

```bash
npm install
npm run build
```

Deploy on Vercel from the repository root. Vercel will detect Next.js automatically.

## Post-Deployment SEO Checklist

- Submit `https://www.deepanshuventures.com/sitemap.xml` to Google Search Console.
- Verify the canonical homepage URL.
- Inspect the homepage and SEO pages in Search Console URL Inspection.
- Add business profiles and social profiles that link back to the official site.
- Keep publishing founder and AI automation insight pages to build topical authority.
