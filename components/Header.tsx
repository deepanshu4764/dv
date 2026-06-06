'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Sparkles } from 'lucide-react';
import { brand, navLinks } from '@/lib/site';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-midnight/82 backdrop-blur-2xl">
      <nav className="container flex h-16 items-center justify-between gap-6" aria-label="Primary navigation">
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-xl" aria-label="Deepanshu Ventures home">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-sm font-black text-midnight shadow-glow">
            DV
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black leading-tight tracking-normal text-white sm:text-lg">
              {brand.name}
            </span>
            <span className="hidden truncate text-xs font-semibold text-slate-400 sm:block">Official founder brand and venture studio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-full px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="focus-ring hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-midnight transition hover:-translate-y-0.5 hover:bg-blue-50 md:inline-flex"
          >
            Start project
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={open}
            type="button"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-white/10 bg-midnight/96 px-4 py-4 lg:hidden">
          <div className="container grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
