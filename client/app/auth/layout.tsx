"use client";
import { createContext, useContext, useState } from "react";

const AuthUIContext = createContext({
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AuthUIContext value={{ isLoading, setIsLoading }}>
      {children}
    </AuthUIContext>
  );
}

export const useAuthUI = () => useContext(AuthUIContext);
