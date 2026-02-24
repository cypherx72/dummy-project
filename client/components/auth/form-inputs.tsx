"use client";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

import { useAuthUI } from "@/app/auth/layout";

export const ActivateAccountSchema = z
  .object({
    email: z.string().regex(/^\d{8}@vupune\.ac\.in$/, {
      message: "Enter a valid university email",
    }),

    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+-=\[\]\\{}|;':",.<>\/?]).{8,}$/,
        {
          message:
            "Password must contain uppercase, lowercase, number, and special character.",
        },
      ),

    "confirm-password": z.string(),
  })
  .refine((data) => data.password === data["confirm-password"], {
    message: "Passwords do not match.",
    path: ["confirm-password"],
  });

const EmailSchema = ActivateAccountSchema.pick({ email: true });
const PasswordSchema = ActivateAccountSchema.pick({ password: true });
const FormSchema = ActivateAccountSchema;

const schemaMap = {
  "verify-account": EmailSchema,
  "reset-password": PasswordSchema,
  "activate-account": FormSchema,
  "sign-in": PasswordSchema && EmailSchema,
} as const;

export type FormValues = {
  email?: string;
  password?: string;
  "confirm-password"?: string;
};

export default function FormInput({
  className,
  ...props
}: React.ComponentProps<"div"> & {
  buttontext: string;
  onSubmitHandler: (values: FormValues) => void;
  email?: string;
  page: "sign-in" | "activate-account" | "reset-password" | "verify-account";
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { page, buttontext, onSubmitHandler, email } = props;
  const { isLoading, setIsLoading } = useAuthUI();

  const Schema = schemaMap[page] ?? FormSchema;
  type inputValues = z.infer<typeof Schema>;

  const form = useForm<inputValues>({
    defaultValues: {
      email: page === "activate-account" && email ? email : "",
      password: "",
      "confirm-password": "",
    },
    resolver: zodResolver(Schema),
  });

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(async (formData) => {
            console.log(formData);
            onSubmitHandler(formData);
            setIsLoading(true);
            try {
            } catch (err) {
              console.log(err);
            } finally {
              setIsLoading(false);
            }
          })}
          noValidate
          className={`flex flex-col gap-y-5 ${page === "activate-account" ? "gap-y-3" : "gap-y-6"} `}
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="tracking-wide">
                    University Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="SRN@vupune.ac.in"
                      {...field}
                      readOnly={page === "activate-account"}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {page === "sign-in" ||
              (page === "activate-account" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>

                      <span
                        onClick={() => {
                          setPasswordVisible((prev) => !prev);
                        }}
                        className="top-13 right-[-10px] absolute hover:bg-none focus:bg-none p-0 size-10 -translate-y-1/2"
                      >
                        {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>

                      {props.buttontext === "Log in" && (
                        <Link
                          href="#"
                          className="ml-auto text-sm hover:underline underline-offset-4"
                        >
                          Forgot your password?
                        </Link>
                      )}

                      <FormMessage className="max-w-[20svw]" />
                    </FormItem>
                  )}
                />
              ))}

            {page === "activate-account" && (
              <FormField
                control={form.control}
                name="confirm-password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>

                    <FormMessage className="max-w-[20svw]" />
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button
            type="submit"
            className="w-full font-sans font-black text-sm"
            disabled={form.formState.isSubmitting}
          >
            {buttontext}
          </Button>
        </form>
      </Form>
    </div>
  );
}
