"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import FormInput, { FormValues } from "@/components/auth/form-inputs";
import { showToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const onSubmitHandler = async (credentials: FormValues) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_URL}/auth/credentials`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        showToast("SignIn Error", "Invalid Credentials", "error");

        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 m-auto w-3/10 font-sans">
      <Card>
        <CardHeader className="gap-0 text-center">
          <CardTitle className="text-2xl">Hi, welcome! 👋</CardTitle>

          <CardDescription>
            Sign in with your Google or LinkedIn account to continue. Connect
            instantly, access your chats, and start messaging securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-6 grid">
            <div className="gap-6 grid">
              <FormInput
                buttontext="Sign in"
                page="sign-in"
                onSubmitHandler={onSubmitHandler}
              />
            </div>

            <div className="flex flex-col gap-4">
              {/* Social Login Buttons */}
              <SocialLoginButtons />
            </div>
            <div className="text-sm text-center">
              Haven&apos;t verifyed yet?{" "}
              <Link
                href="/auth/verify-account"
                className="underline underline-offset-4"
              >
                Verify here
              </Link>
              .
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
