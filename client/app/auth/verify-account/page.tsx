"use client";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { errorToast, showToast } from "@/components/ui/toast";
import FormInput, { FormValues } from "@/components/auth/form-inputs";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export default function ActivationPage() {
  const [activeTab, setActiveTab] = useState<"verifyAccount" | "emailSent">(
    "verifyAccount",
  );

  // Handle email submit
  async function onSubmitHandler(values: FormValues) {
    const email = values.email;

    try {
      const response = await fetch(SERVER_URL + "/auth/activate-account", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Handle HTTP + backend errors
      if (!response.ok || !data.success) {
        showToast(
          "Activation Failed",
          data.message || "Something went wrong",
          "error",
        );
        return;
      }

      setActiveTab("emailSent");
    } catch (err: unknown) {
      //Network error only
      console.log(err);
      errorToast();
    }
  }

  return (
    <Tabs value={activeTab} className="m-auto w-full h-full font-sans">
      <TabsList className="hidden">
        <TabsTrigger value="verifyAccount">Verify Account</TabsTrigger>
        <TabsTrigger value="emailSent">Email Sent</TabsTrigger>
      </TabsList>

      {/* Activation Form */}
      <TabsContent value="verifyAccount" className="m-auto w-1/2 h-full">
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
                    Enter your university email to verify your identity and get
                    started with CampusHub.
                  </p>
                </div>
                <FormInput
                  buttontext="Verify Email"
                  page="verify-account"
                  onSubmitHandler={onSubmitHandler}
                />
              </div>
              <div className="hidden md:block relative bg-muted rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="Image"
                  className="absolute inset-0 rounded-2xl w-full h-full object-cover"
                  fill
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2 text-muted-foreground *:[a]:hover:text-primary text-xs text-center *:[a]:underline *:[a]:underline-offset-4 text-balance">
            <span>
              {" "}
              By clicking continue, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </span>
            <p className="text-xs text">
              © 2026 CampusHub · Vishwakarma University, Pune
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="emailSent" className="m-auto w-1/2 h-full">
        <div className="flex flex-col gap-6 p-4">
          <Card className="p-0">
            <CardContent className="grid md:grid-cols-2 p-3">
              {/* Left Section */}
              <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col items-start gap-4 w-full">
                  <span className="flex flex-row items-center gap-2 font-bold text-xl">
                    <GraduationCap className="bg-blue-950 p-1 rounded-2xl size-12" />
                    <p className="font-serif">CampusHub</p>
                  </span>

                  <p className="font-serif font-bold text-2xl">
                    Check your email 📩
                  </p>

                  <p className="font-sans text-neutral-500 text-sm">
                    We’ve sent an activation link to your university email
                    address. Please open the email and click the link to
                    activate your account.
                  </p>

                  <div className="space-y-2 text-neutral-500 text-sm">
                    <p>• The link will expire in 10 minutes.</p>
                    <p>• Make sure to check your spam or junk folder.</p>
                  </div>

                  <button
                    onClick={() => setActiveTab("verifyAccount")}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Didn’t receive the email? Try again
                  </button>
                </div>
              </div>

              {/* Right Image Section */}
              <div className="hidden md:block relative bg-muted rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=870&auto=format&fit=crop"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="Email Sent"
                  className="absolute inset-0 rounded-2xl w-full h-full object-cover"
                  fill
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex flex-col gap-2 text-muted-foreground *:[a]:hover:text-primary text-xs text-center *:[a]:underline *:[a]:underline-offset-4 text-balance">
            <span>
              By continuing, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </span>
            <p>© 2026 CampusHub · Vishwakarma University, Pune</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
