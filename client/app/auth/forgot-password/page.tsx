"use client";
import { Button } from "@/components/ui/button";
import { MdOutlineEmail } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import z from "zod";
import { LoginInSchema } from "@/config/ZodSchema";
import { useForm } from "react-hook-form";
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
import { useLazyQuery } from "@apollo/client/react";

const emailSchema = LoginInSchema.pick({
  email: true,
});

// query to ResetPassword
const FORGOT_PASSWORD = gql`
  query ForgotPassword($email: String!) {
    forgotPassword: ForgotPassword(input: { email: $email }) {
      message
      code
      status
    }
  }
`;
type ForgotPasswordResponse = {
  forgotPassword: {
    message: string;
    code: string;
    status: number;
  };
};

export default function ResetPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [showIcon, setShowIcon] = useState(true);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const [forgotPassword, { data, loading, error }] =
    useLazyQuery<ForgotPasswordResponse>(FORGOT_PASSWORD);

  const handleInput = () => {
    const value = emailRef.current?.value;
    setShowIcon(value?.length === 0);
  };

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    const email = values.email;

    try {
      //send a request to backend,
      forgotPassword({
        variables: {
          email,
        },
      });

      if (error) {
        showToast(
          "Reset Link",
          "Failed to sent a reset link. Please try again later.",
          "error"
        );
        return;
      }

      console.log(data);
      /* 
      an email is then send to your gmail, with a link to change the password. 
      here simply login an email has been send to your accoutn
    */
      showToast(
        "Reset Link",
        "A reset link has been sent to your email.",
        "success"
      );
      redirect("/auth/login");
    } catch (err) {
      console.log(err);
      showToast(
        "Reset Link",
        "Unable to send reset link. Try again later.",
        "error"
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
        <Form {...form}>
          <form
            noValidate
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative gap-2 grid">
                  <FormLabel htmlFor="email">Email</FormLabel>

                  <div className="relative">
                    {showIcon && (
                      <MdOutlineEmail className="top-2.5 left-3 absolute" />
                    )}

                    <FormControl>
                      <Input
                        {...field}
                        ref={emailRef}
                        id="email"
                        type="email"
                        placeholder="      SRN@vupune.ac.in"
                        onInput={handleInput}
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
