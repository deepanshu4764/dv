'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bike, LogOut, Phone, ShieldCheck, UserRound } from 'lucide-react';

type UserRole = 'customer' | 'rider';

type UserProfile = {
  name: string | null;
  phone: string;
  role: UserRole;
  token: string;
  authenticated: true;
  createdAt: string;
};

const authStorageKeys = {
  authToken: 'deepanshu.authToken',
  userProfile: 'deepanshu.userProfile',
  selectedRole: 'deepanshu.selectedRole'
};

function getStoredProfile(): UserProfile | null {
  try {
    const token = localStorage.getItem(authStorageKeys.authToken);
    const rawProfile = localStorage.getItem(authStorageKeys.userProfile);
    if (!token || !rawProfile) return null;
    const profile = JSON.parse(rawProfile) as UserProfile;
    return profile.authenticated && profile.token === token ? profile : null;
  } catch {
    return null;
  }
}

export function AuthDashboard({ role }: { role: UserRole }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedProfile = getStoredProfile();
    if (!storedProfile) {
      router.replace('/auth/');
      return;
    }
    if (storedProfile.role !== role) {
      router.replace(storedProfile.role === 'customer' ? '/customer/' : '/rider/');
      return;
    }
    setProfile(storedProfile);
  }, [role, router]);

  function logout() {
    localStorage.removeItem(authStorageKeys.authToken);
    localStorage.removeItem(authStorageKeys.userProfile);
    router.replace('/auth/');
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
                Authenticated {isCustomer ? 'customer' : 'rider'}
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                {isCustomer ? 'Customer dashboard' : 'Rider dashboard'}
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {isCustomer
                  ? 'Access orders, payments, venture requests, and AnyTimeTiffin customer flows.'
                  : 'Access assigned delivery, pickup, and field operation workflows.'}
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
            <ShieldCheck className="h-7 w-7 text-blue-200" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-black text-white">Session</h2>
            <p className="mt-2 text-sm font-bold text-slate-400">Mock OTP session active</p>
          </article>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={isCustomer ? '/anytimetiffin-order/index.html' : '/ventures/anytime-tiffin/'} className="focus-ring inline-flex justify-center rounded-2xl bg-white px-6 py-4 font-black text-midnight transition hover:bg-blue-50">
            {isCustomer ? 'Open AnyTimeTiffin' : 'View venture routes'}
          </Link>
          <Link href="/pay/" className="focus-ring inline-flex justify-center rounded-2xl border border-white/14 bg-white/8 px-6 py-4 font-black text-white transition hover:bg-white/12">
            Open payments
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
