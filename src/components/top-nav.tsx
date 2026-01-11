import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserMenu } from "./user-menu";

export async function TopNav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-lg font-bold text-primary-700">
            BI
          </div>
          <div>
            <Link href="/book-insights" className="text-lg font-semibold text-slate-900">
              Book Insights
            </Link>
            <p className="text-xs text-slate-500">Daily insights & premium classes</p>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/book-insights">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/app">Dashboard</Link>
          <UserMenu session={session} />
        </nav>
      </div>
    </header>
  );
}
