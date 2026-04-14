"use client";

import { AssignmentProvider } from "@/context/tasks/provider";
import { useSession } from "@/context/session-context";
import { TasksShell } from "./_components/TasksShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function RoleErrorState() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8 border rounded-md h-[50vh]">
      <h1 className="font-semibold text-xl">Role not found</h1>
      <p className="text-muted-foreground text-sm">
        Your session is missing a role. Please sign in again.
      </p>
      <Button asChild>
        <Link href="/auth/signin">Go to sign in</Link>
      </Button>
    </div>
  );
}

export default function TasksLayout({
  teacher,
  student,
}: {
  teacher: React.ReactNode;
  student: React.ReactNode;
}) {
  const { user, loading } = useSession();

  return (
    <AssignmentProvider>
      <TasksShell>
        {loading ? (
          <div className="animate-pulse border rounded-md h-[50vh]" />
        ) : user?.role === "teacher" || user?.role === "admin" ? (
          teacher
        ) : user?.role === "student" ? (
          student
        ) : (
          <RoleErrorState />
        )}
      </TasksShell>
    </AssignmentProvider>
  );
}
