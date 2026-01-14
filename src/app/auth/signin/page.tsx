"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { type ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [checkingProviders, setCheckingProviders] = useState(true);

  useEffect(() => {
    getProviders()
      .then((prov) => setProviders(prov))
      .catch(() => setProviders(null))
      .finally(() => setCheckingProviders(false));
  }, []);

  const googleAvailable = Boolean(providers?.google);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
        callbackUrl
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push(result?.url ?? callbackUrl);
    } catch (err) {
      console.error("[SIGN_IN_CREDENTIALS]", err);
      setError("Unable to sign in right now. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;
    if (!googleAvailable && !checkingProviders) {
      setError("Google sign-in is not configured. Add GOOGLE_CLIENT_ID/SECRET and restart the app.");
      return;
    }
    setError(null);
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error("[SIGN_IN_GOOGLE]", err);
      setError("Google sign-in failed. Check your connection and try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md">
        <div className="border-b border-slate-100 px-6 py-4">
          <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-600">
            Access your Book Insights subscription.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-slate-500 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
          >
            {googleLoading
              ? "Redirecting to Google..."
              : googleAvailable
                ? "Continue with Google"
                : "Google sign-in unavailable"}
          </Button>
          {!checkingProviders && !googleAvailable ? (
            <p className="text-center text-xs text-slate-500">
              Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment to enable Google sign-in.
            </p>
          ) : null}
          <p className="text-center text-sm text-slate-600">
            New here?{" "}
            <Link className="font-semibold text-primary-600" href="/auth/signup">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="card w-full max-w-md animate-pulse p-6 text-center text-slate-500">
            Loading sign-in...
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
