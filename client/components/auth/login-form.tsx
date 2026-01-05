"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Link from "next/link";
import { SocialLoginButtons } from "./social-login-buttons";
import FormInputs from "./form-inputs";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="gap-0 text-center">
          <CardTitle className="text-xl">Hi, welcome!👋</CardTitle>
          <Alert
            variant="default"
            className="my-6 border-orange-400 text-orange-400"
          >
            <AlertTitle className="font-bold">Notice!</AlertTitle>
            <AlertDescription className="flex flex-col justify-center text-orange-400 text-center">
              If you registered using Google or another provider, please log in
              with that same provider. If you&apos;d prefer to use a password
              instead, you can{" "}
              <Link href="#" className="inline font-medium underline">
                set one here.
              </Link>
            </AlertDescription>
          </Alert>

          <CardDescription>
            Login with your LinkedIn or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gap-6 grid">
            <div className="flex flex-col gap-4">
              {/* Social Login Buttons */}
              <SocialLoginButtons />
            </div>
            <div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-border after:border-t text-sm text-center">
              <span className="z-10 relative bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="gap-6 grid">
              <FormInputs buttontext="Log in" page="login" />
            </div>
            <div className="text-sm text-center">
              Haven&apos;t registerd yet?{" "}
              <Link
                href="/auth/register"
                className="underline underline-offset-4"
              >
                Register here
              </Link>
              .
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-xs text-center *:[a]:underline *:[a]:underline-offset-4 text-balance">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
