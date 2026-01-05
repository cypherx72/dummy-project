"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import FormInputs from "./form-inputs";
import { SocialLoginButtons } from "./social-login-buttons";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-0 overflow-hidden">
        <CardContent className="grid md:grid-cols-2 p-0">
          <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-bold text-2xl">Welcome to Circle Space</h1>
              <p className="text-muted-foreground text-balance">
                Sign in to your account
              </p>
            </div>
            <FormInputs buttontext="Sign in" page="signin" />

            <div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-border after:border-t text-sm text-center">
              <span className="z-10 relative bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="gap-4 grid grid-cols-2">
              {/* Social login buttons */}
              <SocialLoginButtons />
            </div>
          </div>
          <div className="hidden md:block relative bg-muted">
            <Image
              src="/images/sign-up.png"
              priority
              alt="Image"
              className="absolute inset-0 w-full h-full object-cover"
              height={500}
              width={400}
            />
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
