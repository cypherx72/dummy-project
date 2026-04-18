"use client";

import React from "react";
import { TaskUIProvider } from "@/context/tasks/provider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TaskUIProvider>{children}</TaskUIProvider>;
}
