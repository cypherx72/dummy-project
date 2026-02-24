"use client";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CombinedGraphQLErrors, gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { errorToast, showToast } from "../ui/toast";
import FormInput from "./form-inputs";
import { FormValues } from "./form-inputs";

const SEND_VERIFICATION_TOKEN_MUTATION = gql`
  mutation SendVerificationToken($email: String!) {
    data: SendVerificationToken(input: { email: $email }) {
      message
      status
      code
    }
  }
`;

export default function RegistrationForm() {
  const [activeTab, setActiveTab] = useState<"verifyAccount" | "emailSent">(
    "verifyAccount",
  );

  const [sendVerificationToken, { loading, data, error }] = useMutation(
    SEND_VERIFICATION_TOKEN_MUTATION,
    {
      onError: (err) => {
        console.error("🔴 GraphQL Error:", err);
      },
      onCompleted: (data) => {
        console.log("✅ GraphQL Success:", data);
      },
    },
  );

  // Handle email submit
  async function onSubmitHandler(values: FormValues) {
    const email = values.email;

    try {
      const { data, error } = await sendVerificationToken({
        variables: {
          email,
        },
      });
      console.log("after mut call ");
      console.log(data, error);
    } catch (err) {
      if (err instanceof CombinedGraphQLErrors) {
        return showToast("OTP", err.message, "error");
      }

      return errorToast();
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

      {/* <TabsContent value="emailSent">
         
        </TabsContent> */}
    </Tabs>
  );
}
