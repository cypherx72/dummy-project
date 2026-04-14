"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Overview" },
  { href: "/tasks/class-schedule", label: "Class Schedule" },
  { href: "/tasks/attendance", label: "Attendance" },
  { href: "/tasks/assignments-and-quizzes", label: "Assignments & Quizzes" },
  { href: "/tasks/quizzes", label: "Quiz Workspace" },
];

export function TasksShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex flex-col gap-4 p-4 w-full font-sans">
      <header className="flex flex-wrap items-center gap-2 border p-3 rounded-md">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Button
              key={link.href}
              asChild
              variant={active ? "default" : "outline"}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          );
        })}
      </header>
      {children}
    </main>
  );
}
