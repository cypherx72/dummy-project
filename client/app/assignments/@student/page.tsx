"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentUI } from "@/context/tasks/task-context";
import AssignmentsCard from "@/app/dashboard/assignments/assignment-card";
import { StatCard } from "../_components/statsCard";
import CourseCard from "@/app/dashboard/tasks/course-card";
import CalendarEvents from "@/app/dashboard/assignments/calendar-events";
import { WeekCalendar } from "@/app/dashboard/assignments/week-calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  BookOpen,
  Clock3,
  CheckCircle2,
  Star,
  AlertTriangle,
  XCircle,
  CalendarDays,
  ArrowRight,
  Bell,
  Trophy,
} from "lucide-react";
import {
  format,
  isPast,
  isToday,
  formatDistanceToNow,
  differenceInDays,
} from "date-fns";
import { cn } from "@/lib/utils";
import UserCard from "../_components/userCard";
import NavBar from "../_components/navBar";
import NotificationsCard from "@/app/dashboard/assignments/notifications-card";
import AICard from "@/app/dashboard/assignments/ai-card";

type AssignmentStatus = "pending" | "submitted" | "graded" | "late" | "missed";

function parseMs(raw: string): Date {
  const n = Number(raw);
  return isNaN(n) ? new Date(raw) : new Date(n);
}

function getStatus(a: any): AssignmentStatus {
  const sub = a.submissions?.[0];
  if (sub) return sub.status;
  const due = parseMs(a.dueDate);
  return isPast(due) && !isToday(due) ? "missed" : "pending";
}

export default function StudentAssignmentsPage() {
  const router = useRouter();

  const {
    fetchDashboardData,
    fetchAssignments,
    dashboardData,
    dashboardLoading,
    fetchAssignmentsData,
    fetchAssignmentsLoading,
  } = useAssignmentUI();

  useEffect(() => {
    fetchDashboardData();
    fetchAssignments();
  }, [fetchDashboardData, fetchAssignments]);

  const assignments = fetchAssignmentsData?.GetAssignments?.assignments ?? [];
  const courses = dashboardData?.GetDashboardData?.courses ?? [];
  const notifications = dashboardData?.GetDashboardData?.notifications ?? [];

  const pending = assignments.filter((a: any) => {
    const s = getStatus(a);
    return s === "pending" || s === "late";
  }).length;
  const submitted = assignments.filter(
    (a: any) => getStatus(a) === "submitted",
  ).length;
  const graded = assignments.filter(
    (a: any) => getStatus(a) === "graded",
  ).length;
  const missed = assignments.filter(
    (a: any) => getStatus(a) === "missed",
  ).length;

  // Upcoming: pending assignments sorted by due date
  const upcoming = [...assignments]
    .filter((a: any) => {
      const s = getStatus(a);
      return s === "pending" || s === "late";
    })
    .sort(
      (a: any, b: any) =>
        parseMs(a.dueDate).getTime() - parseMs(b.dueDate).getTime(),
    )
    .slice(0, 5);

  // Recent grades
  const recentGrades = assignments
    .filter((a: any) => getStatus(a) === "graded")
    .slice(0, 3);

  const loading = dashboardLoading || fetchAssignmentsLoading;

  return (
    <main className="space-y-6 p-6 font-sans">
      <NavBar />

      <div className="flex gap-4 w-full h-[35lvh]">
        <div className="flex flex-col flex-1 gap-4">
          <UserCard />
          {/* Stats */}
          <div className="gap-4 grid grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <Skeleton className="mb-2 w-24 h-3" />
                    <Skeleton className="w-12 h-8" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <StatCard
                  icon={
                    <Clock3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  }
                  label="Pending"
                  value={pending}
                  color="text-amber-600 dark:text-amber-400"
                  onClick={() =>
                    router.push("/assignments/@student/assignments-and-quizzes")
                  }
                />
                <StatCard
                  icon={
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  }
                  label="Submitted"
                  value={submitted}
                  color="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                  icon={
                    <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  }
                  label="Graded"
                  value={graded}
                  color="text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                  icon={
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  }
                  label="Missed"
                  value={missed}
                  color="text-red-600 dark:text-red-400"
                />
              </>
            )}
          </div>
        </div>

        <section className="flex flex-col gap-2 rounded-2xl w-[28%]">
          <WeekCalendar />
          <CalendarEvents />
        </section>
      </div>

      {/* Main grid */}
      <div className="flex flex-col gap-4">
        {/* Upcoming assignments (2/3) */}
        <div className="flex flex-row items-start gap-3 rounded-2xl overflow-hidden">
          <div className="flex flex-row flex-1 gap-4 p-2 py-4 border-1 rounded-2xl h-full">
            <AssignmentsCard />
          </div>
          <NotificationsCard />
        </div>

        {/* Right column */}
        <div className="flex flex-row gap-4 space-y-4 w-full">
          {/* Notifications */}
          <div className="flex flex-1 p-4 border-1 rounded-2xl h-auto">
            <CourseCard />
          </div>
          {/* Quick links */}
          <Card className="w-[28%]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {[
                {
                  label: "Assignments & Quizzes",
                  href: "/assignments/@student/assignments-and-quizzes",
                  icon: ClipboardList,
                },
                {
                  label: "Class Schedule",
                  href: "/assignments/@student/class-schedule",
                  icon: CalendarDays,
                },
                {
                  label: "Attendance",
                  href: "/assignments/@student/attendance",
                  icon: CheckCircle2,
                },
                {
                  label: "Progress Report",
                  href: "/dashboard/progress-report",
                  icon: Star,
                },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex justify-between items-center hover:bg-muted/40 px-3 py-2.5 rounded-lg w-full transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
