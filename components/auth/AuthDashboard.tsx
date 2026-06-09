'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bike, CreditCard, LogOut, Phone, ShieldCheck, Store, UserRound } from 'lucide-react';
import { getVentureDashboardHref, getVentureStorageKeys, type UserRole, type VentureAuthConfig } from '@/lib/venture-auth';

type UserProfile = {
  name: string | null;
  phone: string;
  role: UserRole;
  ventureId: VentureAuthConfig['id'];
  ventureName: string;
  token: string;
  authenticated: true;
  createdAt: string;
};

function getStoredProfile(venture: VentureAuthConfig): UserProfile | null {
  try {
    const authStorageKeys = getVentureStorageKeys(venture.id);
    const token = localStorage.getItem(authStorageKeys.authToken);
    const rawProfile = localStorage.getItem(authStorageKeys.userProfile);
    if (!token || !rawProfile) return null;

    const profile = JSON.parse(rawProfile) as UserProfile;
    const validRole = profile.role === 'customer' || profile.role === 'rider';
    const validSession = profile.authenticated && profile.token === token && profile.ventureId === venture.id;
    return validRole && validSession ? profile : null;
  } catch {
    return null;
  }
}

export function AuthDashboard({ venture, role }: { venture: VentureAuthConfig; role: UserRole }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedProfile = getStoredProfile(venture);
    if (!storedProfile) {
      router.replace(venture.authHref);
      return;
    }
    if (storedProfile.role !== role) {
      router.replace(getVentureDashboardHref(venture, storedProfile.role));
      return;
    }
    setProfile(storedProfile);
  }, [role, router, venture]);

  function logout() {
    const authStorageKeys = getVentureStorageKeys(venture.id);
    localStorage.removeItem(authStorageKeys.authToken);
    localStorage.removeItem(authStorageKeys.userProfile);
    localStorage.removeItem(authStorageKeys.otpAttempt);
    if (venture.id === 'anytimetiffin' && role === 'customer') {
      localStorage.removeItem('anytimeTiffin.user');
    }
    router.replace(venture.authHref);
  }

  const isCustomer = role === 'customer';
  const Icon = isCustomer ? UserRound : Bike;

  return (
    <section className="container min-h-[calc(100svh-4rem)] py-28">
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-[2rem] p-7 md:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-black text-blue-100">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Authenticated {venture.shortName} {isCustomer ? 'customer' : 'rider'}
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                {venture.shortName} {isCustomer ? 'customer dashboard' : 'rider dashboard'}
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {isCustomer ? venture.customerDashboardDescription : venture.riderDashboardDescription}
              </p>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-midnight">
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <article className="card rounded-3xl p-6">
            <Phone className="h-7 w-7 text-blue-200" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-black text-white">Phone</h2>
            <p className="mt-2 text-sm font-bold text-slate-400">{profile?.phone || 'Loading...'}</p>
          </article>
          <article className="card rounded-3xl p-6">
            <UserRound className="h-7 w-7 text-blue-200" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-black text-white">Name</h2>
            <p className="mt-2 text-sm font-bold text-slate-400">{profile?.name || (isCustomer ? 'Customer' : 'Rider')}</p>
          </article>
          <article className="card rounded-3xl p-6">
            <Store className="h-7 w-7 text-blue-200" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-black text-white">Venture</h2>
            <p className="mt-2 text-sm font-bold text-slate-400">{venture.name}</p>
          </article>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={isCustomer ? venture.customerPrimaryHref : venture.riderPrimaryHref}
            className="focus-ring inline-flex justify-center rounded-2xl bg-white px-6 py-4 font-black text-midnight transition hover:bg-blue-50"
          >
            {isCustomer ? venture.customerPrimaryLabel : venture.riderPrimaryLabel}
          </Link>
          <Link
            href={isCustomer ? venture.secondaryHref : venture.appHref}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-6 py-4 font-black text-white transition hover:bg-white/12"
          >
            {isCustomer ? <CreditCard className="h-5 w-5" aria-hidden="true" /> : <Store className="h-5 w-5" aria-hidden="true" />}
            {isCustomer ? venture.secondaryLabel : 'Open venture page'}
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-400/10 px-6 py-4 font-black text-red-100 transition hover:bg-red-400/15"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
