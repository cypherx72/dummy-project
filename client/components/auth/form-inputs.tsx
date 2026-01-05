"use client";
import { useRef, useState } from "react";
import { IconType } from "react-icons/lib";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { showToast } from "../ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { SignInSchema, LoginInSchema } from "@/config/ZodSchema";
import { credentials } from "@/lib/auth";
import { useAuthUI } from "@/app/auth/layout";

export type pwdType = {
  icon: IconType;
  type: "password" | "text";
};

export const useInputForm = (page: "signin" | "login") => {
  const formInputSchema = page === "signin" ? SignInSchema : LoginInSchema;
  type inputValues = z.infer<typeof formInputSchema>;
  const inputForm = useForm<inputValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formInputSchema),
  });

  return inputForm;
};

export default function FormInputs({
  className,
  ...props
}: React.ComponentProps<"div"> & { buttontext: string } & {
  page: "signin" | "login";
}) {
  const [iconType, setIconType] = useState<pwdType>({
    icon: FaRegEye,
    type: "password",
  });
  const { isLoading, setIsLoading } = useAuthUI();
  const page = props.page; // used to check if its login/signin page
  const form = useInputForm(page);
  const { password, email } = form.getValues();
  const [openDialog, setOpenDialog] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(async (formData) => {
            try {
              setIsLoading(true);

              await credentials({
                credentialArgs: {
                  ...formData,
                },
              });
            } catch (err) {
              const error = err?.toString() || "";
              const isCredentialError = error.includes("User");
              const errorMessage = isCredentialError
                ? error.split(":")[1].trim().split("..")[0]
                : "Something went wrong";
              showToast("Oops Error!", errorMessage + ".", "error");
            } finally {
              setIsLoading(false);
            }
          })}
          noValidate
          className="flex flex-col gap-y-4"
        >
          <div className="gap-3 grid">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="SRN@vupune.ac.in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-3 grid">
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
          </div>

          {page == "signin" ? (
            <>
              <Button
                onClick={async () => {
                  const isValid = await form.trigger();

                  if (isValid) {
                    setOpenDialog(true);
                  }
                }}
                type="button"
                className="w-full font-black text-md leading-3"
                disabled={isLoading}
              >
                {props.buttontext}
              </Button>
              {/* form submition button */}
              <Button
                type="submit"
                className="hidden"
                ref={submitButtonRef}
              ></Button>

              <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm your password?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently set{" "}
                      {email} account password as {password}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => submitButtonRef.current?.click()}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button
              type="submit"
              className="w-full font-black text-md leading-3"
              disabled={isLoading}
            >
              {props.buttontext}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
