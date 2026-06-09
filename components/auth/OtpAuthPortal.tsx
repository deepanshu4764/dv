'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, CheckCircle2, Loader2, Phone, ShieldCheck, Store, UserRound, Users } from 'lucide-react';
import {
  getVentureDashboardHref,
  getVentureStorageKeys,
  type UserRole,
  type VentureAuthConfig
} from '@/lib/venture-auth';

type AuthView = 'login' | 'signup';

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

function sanitizePhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 15);
}

function sanitizeOtp(value: string) {
  return value.replace(/\D/g, '').slice(0, 6);
}

function validatePhone(phone: string) {
  if (!phone) return 'Phone number required';
  if (!/^[0-9]{10,15}$/.test(phone)) return 'Invalid phone number';
  return '';
}

function validateOtp(otp: string) {
  if (!otp) return 'OTP required';
  if (!/^[0-9]{6}$/.test(otp)) return 'Invalid OTP';
  return '';
}

function createMockToken(ventureId: VentureAuthConfig['id']) {
  return `mock_${ventureId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getStoredProfile(venture: VentureAuthConfig): UserProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStorageKeys = getVentureStorageKeys(venture.id);
    const token = localStorage.getItem(authStorageKeys.authToken);
    const rawProfile = localStorage.getItem(authStorageKeys.userProfile);
    if (!token || !rawProfile) return null;

    const profile = JSON.parse(rawProfile) as UserProfile;
    const validRole = profile.role === 'customer' || profile.role === 'rider';
    const validSession = profile.authenticated && profile.token === token && profile.ventureId === venture.id;
    if (!validRole || !validSession) return null;
    return profile;
  } catch {
    return null;
  }
}

function syncAnyTimeTiffinCustomerSession(venture: VentureAuthConfig, user: UserProfile) {
  if (venture.id !== 'anytimetiffin' || user.role !== 'customer') return;

  try {
    const existing = JSON.parse(localStorage.getItem('anytimeTiffin.user') || '{}') as {
      preferences?: {
        spice?: string;
        slot?: string;
        allergies?: string;
      };
    };

    localStorage.setItem(
      'anytimeTiffin.user',
      JSON.stringify({
        name: user.name || 'AnyTimeTiffin Customer',
        mobile: user.phone.slice(-10),
        preferences: {
          spice: existing.preferences?.spice || 'Medium',
          slot: existing.preferences?.slot || 'Lunch: 12:00 PM - 2:00 PM',
          allergies: existing.preferences?.allergies || ''
        }
      })
    );
  } catch {
    localStorage.setItem(
      'anytimeTiffin.user',
      JSON.stringify({
        name: user.name || 'AnyTimeTiffin Customer',
        mobile: user.phone.slice(-10),
        preferences: {
          spice: 'Medium',
          slot: 'Lunch: 12:00 PM - 2:00 PM',
          allergies: ''
        }
      })
    );
  }
}

export function OtpAuthPortal({ venture }: { venture: VentureAuthConfig }) {
  const router = useRouter();
  const authStorageKeys = useMemo(() => getVentureStorageKeys(venture.id), [venture.id]);
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [lastOtpSentAt, setLastOtpSentAt] = useState(0);

  const roleContent = useMemo(
    () => ({
      customer: {
        label: 'Customer',
        description: venture.customerRoleDescription,
        icon: UserRound,
        dashboard: venture.customerDashboardHref
      },
      rider: {
        label: 'Rider',
        description: venture.riderRoleDescription,
        icon: Bike,
        dashboard: venture.riderDashboardHref
      }
    }),
    [venture.customerDashboardHref, venture.customerRoleDescription, venture.riderDashboardHref, venture.riderRoleDescription]
  );

  const activeRole = roleContent[userRole];
  const ActiveRoleIcon = activeRole.icon;
  const isSignup = currentView === 'signup';

  const primaryActionText = useMemo(() => {
    if (isLoading && !isOtpSent) return 'Sending OTP...';
    if (isLoading && isSignup) return 'Creating Account...';
    if (isLoading) return 'Verifying...';
    return isSignup ? 'Register & Login' : 'Verify & Login';
  }, [isLoading, isOtpSent, isSignup]);

  useEffect(() => {
    const existingRole = localStorage.getItem(authStorageKeys.selectedRole);
    if (existingRole === 'customer' || existingRole === 'rider') {
      setUserRole(existingRole);
    }

    const profile = getStoredProfile(venture);
    if (profile) {
      setAuthToken(profile.token);
      router.replace(getVentureDashboardHref(venture, profile.role));
    }
  }, [authStorageKeys.selectedRole, router, venture]);

  function clearFeedback() {
    setErrorMessage('');
    setSuccessMessage('');
  }

  function resetOtpState() {
    setOtpCode('');
    setIsOtpSent(false);
    setGeneratedOTP('');
    setOtpExpiresAt(0);
    localStorage.removeItem(authStorageKeys.otpAttempt);
  }

  function switchView(view: AuthView) {
    setCurrentView(view);
    clearFeedback();
    resetOtpState();
    if (view === 'login') setFullName('');
  }

  function handleRoleChange(role: UserRole) {
    setUserRole(role);
    localStorage.setItem(authStorageKeys.selectedRole, role);
    clearFeedback();
    resetOtpState();
  }

  async function handleSendOTP(phone: string) {
    const phoneError = validatePhone(phone);
    if (phoneError) throw new Error(phoneError);

    const now = Date.now();
    if (lastOtpSentAt && now - lastOtpSentAt < 30000) {
      throw new Error('Please wait before requesting another OTP.');
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 5 * 60 * 1000;
    setGeneratedOTP(otp);
    setOtpExpiresAt(expiresAt);
    setLastOtpSentAt(Date.now());
    setIsOtpSent(true);
    localStorage.setItem(
      authStorageKeys.otpAttempt,
      JSON.stringify({
        phone,
        role: userRole,
        ventureId: venture.id,
        otp,
        expiresAt
      })
    );

    return { success: true, otp };
  }

  async function handleVerifyOTP(phone: string, otp: string, role: UserRole, name: string | null = null) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const phoneError = validatePhone(phone);
    if (phoneError) throw new Error(phoneError);

    const otpError = validateOtp(otp);
    if (otpError) throw new Error(otpError);

    let expectedOtp = generatedOTP;
    let expectedExpiry = otpExpiresAt;
    try {
      const savedAttempt = JSON.parse(localStorage.getItem(authStorageKeys.otpAttempt) || '{}') as {
        phone?: string;
        role?: UserRole;
        ventureId?: VentureAuthConfig['id'];
        otp?: string;
        expiresAt?: number;
      };
      if (savedAttempt.phone === phone && savedAttempt.role === role && savedAttempt.ventureId === venture.id) {
        expectedOtp = savedAttempt.otp || expectedOtp;
        expectedExpiry = savedAttempt.expiresAt || expectedExpiry;
      }
    } catch {
      expectedOtp = generatedOTP;
    }

    if (!expectedOtp) throw new Error('Send OTP first');
    if (Date.now() > expectedExpiry) throw new Error('OTP expired');
    if (otp !== expectedOtp) throw new Error('Wrong OTP');

    const token = createMockToken(venture.id);
    const user: UserProfile = {
      name: name || null,
      phone,
      role,
      ventureId: venture.id,
      ventureName: venture.name,
      token,
      authenticated: true,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(authStorageKeys.authToken, token);
    localStorage.setItem(authStorageKeys.userProfile, JSON.stringify(user));
    localStorage.setItem(authStorageKeys.selectedRole, role);
    localStorage.removeItem(authStorageKeys.otpAttempt);
    syncAnyTimeTiffinCustomerSession(venture, user);
    setAuthToken(token);

    return {
      success: true,
      token,
      user
    };
  }

  async function onSendOtp() {
    clearFeedback();
    const cleanPhone = sanitizePhone(phoneNumber);
    setPhoneNumber(cleanPhone);

    if (isSignup && fullName.trim().length < 3) {
      setErrorMessage('Full name must be at least 3 characters');
      return;
    }

    try {
      const result = await handleSendOTP(cleanPhone);
      setSuccessMessage(`OTP Sent Successfully. Demo OTP: ${result.otp}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Network Error');
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify() {
    clearFeedback();
    const cleanPhone = sanitizePhone(phoneNumber);
    const cleanOtp = sanitizeOtp(otpCode);
    setPhoneNumber(cleanPhone);
    setOtpCode(cleanOtp);

    if (isSignup && fullName.trim().length < 3) {
      setErrorMessage('Full name must be at least 3 characters');
      return;
    }

    try {
      setIsLoading(true);
      const result = await handleVerifyOTP(cleanPhone, cleanOtp, userRole, isSignup ? fullName.trim() : null);
      setSuccessMessage(isSignup ? 'Account Created Successfully' : 'Login Successful');
      router.push(getVentureDashboardHref(venture, result.user.role));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'OTP Verification Failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="container min-h-[calc(100svh-4rem)] py-28" aria-labelledby="auth-title">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="glass rounded-[2rem] p-7 md:p-9">
          <Link href="/ventures/" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-black text-blue-100">
            <Store className="h-4 w-4" aria-hidden="true" />
            {venture.name} access
          </Link>
          <h1 id="auth-title" className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
            Secure {venture.shortName} login for customers and riders.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{venture.authDescription}</p>
          <div className="mt-7 grid gap-3 text-sm font-bold text-slate-300">
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-200" aria-hidden="true" />
              Role selection is saved only for this venture.
            </p>
            <p className="inline-flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-200" aria-hidden="true" />
              OTPs are mock-generated locally for immediate testing.
            </p>
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-200" aria-hidden="true" />
              Sessions redirect into {venture.shortName} dashboards.
            </p>
          </div>
          <Link href={venture.appHref} className="focus-ring mt-8 inline-flex items-center justify-center rounded-2xl border border-white/14 bg-white/8 px-5 py-3 text-sm font-black text-white transition hover:bg-white/12">
            Open {venture.shortName}
          </Link>
        </div>

        <div className="card rounded-[2rem] p-5 shadow-premium sm:p-7 md:p-8">
          <div className="mb-6 flex rounded-2xl border border-white/10 bg-white/5 p-1" role="tablist" aria-label="Authentication view">
            {(['login', 'signup'] as AuthView[]).map((view) => (
              <button
                key={view}
                type="button"
                role="tab"
                aria-selected={currentView === view}
                className={`focus-ring min-h-11 flex-1 rounded-xl px-4 text-sm font-black transition ${
                  currentView === view ? 'bg-white text-midnight shadow-glow' : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
                onClick={() => switchView(view)}
              >
                {view === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-blue-200">Choose role</p>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Choose user role">
              {(['customer', 'rider'] as UserRole[]).map((role) => {
                const roleData = roleContent[role];
                const RoleIcon = roleData.icon;
                const selected = userRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`focus-ring rounded-2xl border p-4 text-left transition ${
                      selected ? 'border-blue-300/60 bg-blue-300/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/8'
                    }`}
                    onClick={() => handleRoleChange(role)}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? 'bg-white text-midnight' : 'bg-white/10 text-blue-200'}`}>
                        <RoleIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-black">{roleData.label}</span>
                    </span>
                    <span className="mt-3 block text-sm leading-6 text-slate-400">{roleData.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form className="grid gap-4" onSubmit={(event) => event.preventDefault()} aria-label={isSignup ? `Sign up for ${venture.name}` : `Login to ${venture.name}`}>
            {isSignup ? (
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Full Name
                <span className="relative">
                  <Users className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                  <input
                    className="field pl-12"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value.replace(/[<>]/g, '').slice(0, 80))}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-label="Full name"
                  />
                </span>
              </label>
            ) : null}

            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Phone Number
              <span className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input
                  className="field pl-12"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(sanitizePhone(event.target.value))}
                  placeholder="10 to 15 digit mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                  aria-label="Phone number"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-300">
              OTP Code
              <input
                className="field tracking-[0.24em]"
                value={otpCode}
                onChange={(event) => setOtpCode(sanitizeOtp(event.target.value))}
                placeholder="000000"
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="Six digit OTP code"
                disabled={!isOtpSent}
              />
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100" role="alert">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100" role="status">
                {successMessage}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-5 py-3 font-black text-white transition hover:bg-white/12 disabled:cursor-wait disabled:opacity-60"
                onClick={onSendOtp}
                disabled={isLoading}
              >
                {isLoading && !isOtpSent ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
                {isLoading && !isOtpSent ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <button
                type="button"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-100 via-white to-blue-200 px-5 py-3 font-black text-midnight transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onVerify}
                disabled={isLoading || !isOtpSent}
              >
                {isLoading && isOtpSent ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ActiveRoleIcon className="h-5 w-5" aria-hidden="true" />}
                {primaryActionText}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm font-bold text-slate-300">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="focus-ring rounded-lg px-2 py-1 font-black text-blue-200 transition hover:text-white"
              onClick={() => switchView(isSignup ? 'login' : 'signup')}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </div>

          {authToken ? <p className="mt-4 text-center text-xs font-bold text-slate-500">Active {venture.shortName} mock token restored for this browser.</p> : null}
        </div>
      </div>
    </section>
  );
}
