"use client";

import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <section className="flex flex-col justify-center items-center m-auto h-screen text-white">
      <h1 className="font-bold text-4xl">Access Denied</h1>
      <p className="mt-4 text-lg">You don’t have permission to sign in.</p>
      <p className="mt-4 text-red-500 text-lg">
        The email you used is not authorized. Please sign in with your
        university email address (e.g., <strong>srn@vupune.ac.in</strong>).
      </p>
      <Link
        href="/auth/login"
        className="bg-blue-600 hover:bg-blue-700 mt-6 px-4 py-2 rounded transition"
      >
        Back to Sign In
      </Link>
    </section>
  );
}
