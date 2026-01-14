import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

type NextAuthRouteContext = {
  params: { nextauth: string[] };
};

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, context: NextAuthRouteContext) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);

  // Handle mis-ordered OAuth callback (/api/auth/google/callback) by redirecting to the correct path.
  if (parts[0] === "api" && parts[1] === "auth" && parts[3] === "callback") {
    const provider = parts[2];
    return NextResponse.redirect(new URL(`/api/auth/callback/${provider}${url.search}`, url));
  }

  return handler(req, context);
}

export async function POST(req: NextRequest, context: NextAuthRouteContext) {
  return handler(req, context);
}
