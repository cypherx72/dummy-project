"use client";

import { TaskUIProvider } from "@/context/tasks/provider";
import { useSession } from "@/context/session-context";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SpinnerButton } from "./_components/spinner";

function SessionErrorState() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8 border rounded-md h-[50vh]">
      <h1 className="font-semibold text-xl">Session not found</h1>
      <p className="text-muted-foreground text-sm">
        Oops! We couldn’t find your session. Please sign in again to continue.
      </p>
      <Button asChild>
        <Link href="/auth/signin">Go to sign in</Link>
      </Button>
    </div>
  );
}

export default function AssignmentsLayout({
  teacher,
  student,
}: {
  teacher: React.ReactNode;
  student: React.ReactNode;
}) {
  const { user, loading } = useSession();

  const content = loading ? (
    <SpinnerButton />
  ) : user?.role === "teacher" || user?.role === "admin" ? (
    teacher
  ) : user?.role === "student" ? (
    student
  ) : (
    <SessionErrorState />
  );

  return (
    <TaskUIProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full min-h-screen overflow-auto">
          {content}
        </SidebarInset>
      </SidebarProvider>
    </TaskUIProvider>
  );
}
