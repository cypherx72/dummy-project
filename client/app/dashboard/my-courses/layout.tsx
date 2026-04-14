"use client";

import { AssignmentProvider } from "@/context/tasks/provider";

export default function MyCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AssignmentProvider>{children}</AssignmentProvider>;
}
