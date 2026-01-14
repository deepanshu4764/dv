"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: normalizedEmail, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to sign up");
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
        callbackUrl
      });

      if (result?.error) {
        setError("Account created, but we couldn't sign you in automatically. Please sign in.");
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      router.push(result?.url ?? callbackUrl);
    } catch (err) {
      console.error("[SIGN_UP]", err);
      setError("Unable to sign up right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md">
        <div className="border-b border-slate-100 px-6 py-4">
          <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-600">Start your Book Insights journey.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password (min 8 characters)</label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                autoComplete="new-password"
                required
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
          <div>
            <label className="text-sm font-medium text-slate-700">Confirm password</label>
            <div className="relative mt-1">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-slate-500 transition hover:text-slate-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-primary-600" href="/auth/signin">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
