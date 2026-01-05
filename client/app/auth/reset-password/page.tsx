"use client";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { useRef, useState } from "react";
import z from "zod";
import { ResetSchema } from "@/config/ZodSchema";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/components/ui/toast";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { pwdType } from "@/components/auth/form-inputs";
import { redirect, useSearchParams } from "next/navigation";

// query to ResetPassword
const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $token: String!) {
    resetPassword: ResetPassword(
      input: { token: $token, password: $password }
    ) {
      message
      code
      status
    }
  }
`;
type ResetPasswordResponse = {
  resetPassword: {
    message: string;
    code: string;
    status: number;
  };
};

export default function ResetPassword() {
  const [iconType, setIconType] = useState<pwdType>({
    icon: FaRegEye,
    type: "password",
  });

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  const [resetPassword, { loading }] =
    useMutation<ResetPasswordResponse>(RESET_PASSWORD);

  const searchParams = useSearchParams();

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    const password = values.password;
    const confirmpassword = values.confirmpassword;

    if (password !== confirmpassword) {
      showToast(
        "Reset Password",
        "Passwords do not match. Please re-enter both fields to ensure they are the same.",
        "error"
      );
      return;
    }

    try {
      const token = searchParams.get("token");

      const { data, error } = await resetPassword({
        variables: {
          token,
          password,
        },
      });

      if (error) {
        console.log(error);
      }
      //todo: fix here
      if (data?.resetPassword.status === 200) {
        showToast("", "", "success");
        redirect("/auth/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        <Form {...form}>
          <form
            noValidate
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type={iconType.type} {...field} />
                  </FormControl>

                  <iconType.icon
                    size={12}
                    onClick={() => {
                      setIconType((prevIcon) =>
                        prevIcon.type === "password"
                          ? { icon: FaRegEyeSlash, type: "text" }
                          : { icon: FaRegEye, type: "password" }
                      );
                    }}
                    className="top-10 right-3 absolute hover:bg-none focus:bg-none p-0 -translate-y-1/2"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage className="max-w-[20svw]" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              Confirm
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
