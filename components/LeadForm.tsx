'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { googleSheetsEndpoint } from '@/lib/site';

type LeadFormProps = {
  eventType: 'CONTACT_SUBMITTED' | 'HIRING_SUBMITTED' | 'NEWSLETTER_SIGNUP';
  compact?: boolean;
};

export function LeadForm({ eventType, compact = false }: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value || '').trim()]));

    setStatus('sending');

    try {
      await fetch(googleSheetsEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'Deepanshu Ventures Next.js website',
          eventType,
          pageTitle: document.title,
          pageUrl: window.location.href,
          ...data,
          data
        })
      });

      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="grid gap-3" aria-label="Join Deepanshu Ventures updates">
        <input type="hidden" name="source_form" value="Footer newsletter" />
        <input type="hidden" name="interest" value="Deepanshu Ventures updates" />
        <input className="field" name="name" placeholder="Your name" required />
        <input className="field" name="mobile" placeholder="Mobile number" required pattern="[0-9+\-\s]{10,}" />
        <button className="rounded-2xl bg-white px-5 py-3 font-black text-midnight transition hover:bg-blue-50" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Join updates'}
        </button>
        <Status status={status} />
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" aria-label="Contact Deepanshu Ventures">
      <input type="hidden" name="source_form" value="Main contact form" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Name
          <input className="field" name="name" placeholder="Your name" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Mobile
          <input className="field" name="mobile" placeholder="+91 89503 78717" required pattern="[0-9+\-\s]{10,}" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Email
          <input className="field" name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Interest
          <select className="field" name="interest" defaultValue="AI automation">
            <option>AI automation</option>
            <option>Founder branding</option>
            <option>Website and funnel</option>
            <option>Digital growth</option>
            <option>Hiring or internship</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-slate-300">
        Message
        <textarea className="field min-h-32 resize-y" name="message" placeholder="Tell me what you want to build, grow, automate, or discuss." required />
      </label>
      <button
        className="rounded-2xl bg-white px-6 py-4 font-black text-midnight transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send message to Deepanshu Ventures'}
      </button>
      <Status status={status} />
    </form>
  );
}

function Status({ status }: { status: 'idle' | 'sending' | 'sent' | 'error' }) {
  if (status === 'idle' || status === 'sending') return null;
  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm font-bold ${status === 'sent' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-orange-400/30 bg-orange-400/10 text-orange-200'}`}>
      {status === 'sent'
        ? 'Submitted. Your details were sent to the Deepanshu Ventures Google Sheet.'
        : 'Could not submit right now. Please use WhatsApp or email too.'}
    </p>
  );
}
