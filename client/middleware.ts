import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";
const AUTH_PAGES = [
  "/auth/signin",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/activate-account",
  "/auth/verify-account",
];
const SERVER_SESSION_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";

  let isAuthenticated = false;
  try {
    const res = await fetch(`${SERVER_SESSION_URL}/auth/session`, {
      headers: { cookie: cookieHeader },
      // 3-second budget; don't block the user indefinitely
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      isAuthenticated = data?.authenticated === true;
    }
  } catch {
    // Network error — fail closed: redirect to sign-in
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth/signin";
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
