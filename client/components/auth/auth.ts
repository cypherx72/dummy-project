const AUTH_BASE = "http://localhost:4000/auth";
const FRONTEND_BASE = "http://localhost:3000";
/**
 * Fetch CSRF token from the Express Auth.js backend.
 * Required before any credentials-based sign-in POST.
 */
export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${AUTH_BASE}/csrf`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch CSRF token");
  }
  const data = await res.json();
  return data.csrfToken;
}
/**
 * Sign in with email/password credentials via the Express Auth.js backend.
 * Uses the two-step flow: fetch CSRF token → POST to /auth/callback/credentials.
 */
export async function signInWithCredentials(
  email: string,
  password: string,
  callbackUrl = `${FRONTEND_BASE}/dashboard`,
): Promise<{ ok: boolean; error?: string; url?: string }> {
  const csrfToken = await fetchCsrfToken();
  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl,
  });
  const res = await fetch(`${AUTH_BASE}/callback/credentials`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    redirect: "manual", // Don't auto-follow so we can inspect the redirect
  });
  // Auth.js redirects on success (302) — the session cookie is set
  if (res.type === "opaqueredirect" || res.status === 302) {
    const location = res.headers.get("location");
    return { ok: true, url: location || callbackUrl };
  }
  // If the response is OK but not a redirect, try to parse for errors
  if (res.ok) {
    return { ok: true, url: callbackUrl };
  }
  return { ok: false, error: "Invalid email or password" };
}
/**
 * Redirect to an OAuth provider via the Express Auth.js backend.
 * This MUST be a full browser redirect (not fetch).
 */
export function signInWithOAuth(
  provider: "google" | "linkedIn",
  callbackUrl = `${FRONTEND_BASE}/dashboard`,
): void {
  const params = new URLSearchParams({ callbackUrl });
  window.location.href = `${AUTH_BASE}/signin/${provider}?${params.toString()}`;
}
/**
 * Fetch the current session from the backend.
 */
export async function getSession() {
  const res = await fetch(`${AUTH_BASE}/session`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const session = await res.json();
  return session?.user ? session : null;
}
/**
 * Sign out by redirecting to the Auth.js signout endpoint.
 */
export function signOut(callbackUrl = `${FRONTEND_BASE}/`) {
  window.location.href = `${AUTH_BASE}/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
