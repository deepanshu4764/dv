"use client";

import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export function UserMenu({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/signin" className="text-primary-600">
          Sign in
        </Link>
        <Link href="/auth/signup" className="rounded-lg bg-primary-600 px-3 py-2 text-white hover:bg-primary-700">
          Get started
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-slate-700 sm:inline">
        Hi, {session.user.name ?? "Reader"}
      </span>
      <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </Button>
    </div>
  );
}
