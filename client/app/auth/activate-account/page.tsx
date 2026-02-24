"use client";
import { gql } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";

import { Card, CardContent } from "@/components/ui/card";
import FormInput, { FormValues } from "@/components/auth/form-inputs";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

import { GraduationCap, BookOpen, Users, Shield } from "lucide-react";

const features = [
  { icon: BookOpen, text: "Access course materials & resources" },
  { icon: Users, text: "Connect with peers & faculty" },
  { icon: Shield, text: "Secure university-verified identity" },
];

const VERIFY_AUTH_TOKEN_QUERY = gql`
  query VerifyAuthToken($input: VerifyAuthTokenInput!) {
    authTokenResponse: VerifyAuthToken(input: $input) {
      message
      code
      status
    }
  }
`;

const CLEAR_AUTH_TOKEN = gql`
  mutation ClearAuthToken {
    clearAuthTokenResponse: ClearAuthToken {
      message
      code
      status
    }
  }
`;

export default function ActivateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const auth_token = searchParams.get("token");
  const email = searchParams.get("email");

  const { data, loading, error } = useQuery(VERIFY_AUTH_TOKEN_QUERY, {
    variables: {
      input: {
        auth_token,
        email,
      },
    },
    skip: !auth_token && !email,
  });

  const [clearAuthToken] = useMutation(CLEAR_AUTH_TOKEN);

  if (!auth_token) return router.push("verify-account");

  if (loading) return <p>loading...</p>;
  if (error) {
    console.log(error);
    return <>derro</>;
  }

  if (data) console.log(data);

  // if data is 401 that means token has expired

  const onSubmitHandler = async (formData: FormValues) => {
    console.log(formData);
    const { email, password } = formData;

    const res = await fetch("http://localhost:4000/auth/credentials", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    return res.json();
  };

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
                email={data?.authTokenResponse?.message}
                buttontext="Activate account"
                page="activate-account"
                onSubmitHandler={onSubmitHandler}
              />
            </div>

            <div className="hidden md:block relative bg-gradient-to-r from-blue-700 to-pink-700 rounded-2xl font-sans 00">
              {/* <Image
                src="https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?q=80&w=733&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="University library with warm golden lighting"
                fill
                priority
                className="absolute inset-0 rounded-2xl w-full h-full object-cover"
              /> */}
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
