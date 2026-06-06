import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container flex min-h-[70svh] items-center pt-24">
      <div className="glass max-w-2xl rounded-[2rem] p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">404</p>
        <h1 className="mt-5 text-4xl font-black text-white">Page not found</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          This Deepanshu Ventures page does not exist yet. Return to the official homepage for company, founder, AI, digital,
          Gurgaon, and innovation information.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 font-black text-midnight">
          Back to Deepanshu Ventures
        </Link>
      </div>
    </section>
  );
}
