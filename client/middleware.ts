import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/tasks"];
const SERVER_SESSION_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";

  let isAuthenticated = false;
  try {
    const res = await fetch(`${SERVER_SESSION_URL}/auth/session`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      isAuthenticated = data?.authenticated === true;
    }
  } catch {
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
  matcher: ["/dashboard/:path*", "/tasks/:path*"],
};
