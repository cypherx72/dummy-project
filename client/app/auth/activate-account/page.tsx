"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormInput, { FormValues } from "@/components/auth/form-inputs";
import Image from "next/image";
import { GraduationCap, BookOpen, Users, Shield } from "lucide-react";
import LoadingState from "@/components/ui/loading-state";
import { errorToast, showToast } from "@/components/ui/toast";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

const features = [
  { icon: BookOpen, text: "Access course materials & resources" },
  { icon: Users, text: "Connect with peers & faculty" },
  { icon: Shield, text: "Secure university-verified identity" },
];

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const verify = async () => {
      if (!token || !email) return;

      try {
        const response = await fetch(SERVER_URL + "/auth/verify-token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, type: "activation_token" }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.push("/auth/verify-account");
        }

        if (response.ok) {
          setVerifiedEmail(data.data.email);
        }
      } catch (err: unknown) {
        console.log(err);
        errorToast();
      }
    };

    verify();
  }, [token, email, router]);

  const onSubmitHandler = async (formData: FormValues) => {
    const { email, password } = formData;

    try {
      const response = await fetch(SERVER_URL + "/auth/credentials", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast(
          "Authentication Error",
          data.message || "Invalid Credentials",
          "error",
        );
      }

      await fetch(SERVER_URL + "/auth/clear-token", {
        method: "POST",
        body: JSON.stringify({ type: "activation_token" }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      console.log(err);
      errorToast();
    }
  };

  if (!verifiedEmail) {
    return (
      <LoadingState
        title="Verifying your account"
        description="Please wait while we confirm your activation link."
        fullScreen={true}
      />
    );
  }

  return (
    <div className="m-auto w-2/3 h-full">
      <div className="flex flex-col gap-6 p-4">
        <Card className="p-0">
          <CardContent className="grid md:grid-cols-2 p-3">
            <div className="flex flex-col gap-6 p-6">
              <div className="flex flex-col items-start gap-4 w-full">
                <span className="flex flex-row items-center gap-2 font-bold text-xl">
                  <GraduationCap className="bg-blue-950 p-1 rounded-2xl size-12" />
                  <p className="font-serif">CampusHub</p>
                </span>
                <p className="font-serif font-bold text-2xl">
                  Activate your account
                </p>
                <p className="font-sans text- text-neutral-500 text-sm">
                  Secure your account and get started with CampusHub.
                </p>
              </div>
              <FormInput
                email={verifiedEmail as string}
                buttontext="Activate account"
                page="activate-account"
                onSubmitHandler={onSubmitHandler}
              />
              <SocialLoginButtons />
            </div>

            <div className="hidden md:block relative bg-gradient-to-r from-blue-700 to-pink-700 rounded-2xl font-sans 00">
              <Image
                src="https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?q=80&w=733&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="University library with warm golden lighting"
                fill
                priority
                className="absolute inset-0 rounded-2xl w-full h-full object-cover"
              />
              <div className="absolute rounded-r-lg" />
              <div className="z-10 relative flex flex-col justify-between items-center p-10 h-full">
                <div />
                <div className="space-y-6">
                  <blockquote className="space-y-3">
                    <p className="font-display font-bold text-white/90 text-2xl leading-snug">
                      &quot;Once you know what failure feels like, determination
                      chases success.&quot;
                    </p>
                    <footer className="font-medium text-white/80 text-sm italic">
                      ~ Kobe Bryant
                    </footer>
                  </blockquote>
                  <div className="space-y-3">
                    {features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-white/70"
                      >
                        <div className="flex justify-center items-center bg-primary-foreground/10 rounded-md w-8 h-8">
                          <f.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs">
                  © 2026 CampusHub · Vishwakarma University, Pune
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
