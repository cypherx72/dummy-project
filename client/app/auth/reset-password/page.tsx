"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingState from "@/components/ui/loading-state";
import { showToast } from "@/components/ui/toast";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FormInput, { FormValues } from "@/components/auth/form-inputs";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function ResetPassword() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [loadingVerify, setLoadingVerify] = useState(true);

  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token || !email) {
        router.push("/auth/verify-account");
        return;
      }

      try {
        const response = await fetch(SERVER_URL + "/auth/verify-token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, type: "reset_token" }),
        });

        if (!response.ok) {
          router.push("/auth/verify-account");
          return;
        }

        const data = await response.json();
        setVerifiedEmail(data.data.email);
      } catch (err) {
        console.log(err);
        router.push("/auth/verify-account");
      } finally {
        setLoadingVerify(false);
      }
    };

    verify();
  }, [token, email, router]);

  const onSubmitHandler = async (values: FormValues) => {
    const password = values.password;

    try {
      const response = await fetch(SERVER_URL + "/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, token, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        showToast(
          "Reset Error",
          "Failed to reset password. Please try again later.",
          "error",
        );
        router.push("/auth/forgot-password");
        return;
      }

      router.push("/auth/signin");
    } catch (err) {
      console.log(err);

      showToast(
        "Reset Error",
        "Failed to reset password. Please try again later.",
        "error",
      );
    }
  };

  if (loadingVerify) {
    return (
      <LoadingState
        title="Verifying your account"
        description="Please wait while we confirm your activation link."
        fullScreen={true}
      />
    );
  }

  return (
    <Card className="m-auto p-6 w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle className="font-bold text-2xl">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Choose a new password. For your security, it must be strong and
          different from any password you&apos;ve used before.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-y-6">
        <FormInput
          email={verifiedEmail as string}
          buttontext="Reset Password"
          page="reset-password"
          onSubmitHandler={onSubmitHandler}
        />
      </CardContent>
    </Card>
  );
}
