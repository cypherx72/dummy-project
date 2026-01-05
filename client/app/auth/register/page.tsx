"use client";
import RegistrationForm from "@/components/auth/registeration-form";
import { showToast } from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";

import { useEffect } from "react";
export default function IdentityVerificationPage() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("enc_str");

  useEffect(() => {
    if (!encoded) return;

    try {
      const decoded = atob(encoded);

      console.log("Decoded:", decoded);

      if (decoded === "no-token") {
        showToast(
          "Error Oops!",
          "Your session for this action is no longer active. Please start the activation process again.",
          "error",
          Infinity
        );
      }
    } catch (e) {
      showToast("Error", "The session link is invalid.", "error", Infinity);
    }
  }, [encoded]);

  return (
    <menu className="m-auto">
      <RegistrationForm />
    </menu>
  );
}
