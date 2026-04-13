"use client";

import { TaskUIProvider } from "@/context/tasks/provider";

export default function MyCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TaskUIProvider>{children}</TaskUIProvider>;
}
