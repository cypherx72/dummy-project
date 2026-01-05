"use client";
/* Social login buttons */

import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { providerMap } from "@/auth";
import { SignIn } from "@/lib/auth";
import { useAuthUI } from "@/app/auth/layout";

export function SocialLoginButtons() {
  const { isLoading, setIsLoading } = useAuthUI();

  return Object.values(providerMap).map((provider) => (
    <Button
      key={provider.id}
      onClick={async () => {
        try {
          setIsLoading(true);
          const response = await SignIn(provider.id);
          return response;
        } catch (err) {
          console.log(err);
          setIsLoading(false);
        }
      }}
      variant="outline"
      type="submit"
      disabled={isLoading}
      className="flex justify-center items-center gap-2 w-full"
    >
      {provider.name === "Google" ? <FaGoogle /> : <FaLinkedinIn />}
      {provider.name}
    </Button>
  ));
}
