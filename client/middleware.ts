import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/assignments"];
const SERVER_SESSION_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const GENERIC_ERR = () => {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth/signin";
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  };

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";

  try {
    const res = await fetch(`${SERVER_SESSION_URL}/auth/session`, {
      headers: { cookie: cookieHeader },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      GENERIC_ERR();
    }
  } catch {
    GENERIC_ERR();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/assignments/:path*"],
};
