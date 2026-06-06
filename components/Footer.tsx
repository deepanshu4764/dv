import Link from 'next/link';
import { brand, navLinks, seoKeywords, socialLinks } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight/80 py-12">
      <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-midnight">DV</span>
            <span className="text-lg font-black">{brand.name}</span>
          </Link>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
            Official website for Deepanshu Ventures: founder-led AI automation, digital growth, technology systems, startup
            execution, and business innovation in India and Gurgaon.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {seoKeywords.slice(0, 8).map((keyword) => (
              <span key={keyword} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Internal links</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-400">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Contact</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-400">
            <a href={`mailto:${brand.email}`} className="transition hover:text-white">
              {brand.email}
            </a>
            <a href={brand.whatsapp} className="transition hover:text-white">
              {brand.phone}
            </a>
            <a href={`mailto:${brand.hiringEmail}`} className="transition hover:text-white">
              {brand.hiringEmail}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 transition hover:bg-white hover:text-midnight"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
