"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";

import { showToast } from "@/components/ui/toast";
import FormInput, { FormValues } from "@/components/auth/form-inputs";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function ResetPassword() {
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) throw new Error("Failed");

      showToast(
        "Reset Link",
        "If an account exists with this email, a reset link has been sent.",
        "success",
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Reset Link",
        "Unable to process request. Please try again later.",
        "error",
      );
    }
  };

  return (
    <Card className="m-auto p-6 w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle className="font-bold text-2xl">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address below to receive a reset link and regain
          access to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-y-6">
        <FormInput
          page="forgot-password"
          onSubmitHandler={onSubmit}
          buttontext="Submit"
        />
      </CardContent>
    </Card>
  );
}
