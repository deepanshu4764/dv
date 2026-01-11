import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/app") || req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"]
};
