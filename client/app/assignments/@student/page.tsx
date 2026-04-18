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
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Star,
  XCircle,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { isPast, isToday } from "date-fns";
import UserCard from "../_components/userCard";
import NavBar from "../_components/navBar";
import NotificationsCard from "@/app/dashboard/assignments/notifications-card";

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
    fetchAssignments,
    fetchNotifications,
    fetchAssignmentsData,
    fetchEnrolledCourses,
    fetchRecentEmails,
    fetchUpcomingEvents,
    fetchAlarms,
    fetchAssignmentsLoading,
  } = useAssignmentUI();

  useEffect(() => {
    fetchAssignments();
    fetchNotifications();
    fetchEnrolledCourses();
    fetchRecentEmails();
    fetchAlarms();
    fetchUpcomingEvents();
  }, [
    fetchAssignments,
    fetchNotifications,
    fetchUpcomingEvents,
    fetchAlarms,
    fetchEnrolledCourses,
    fetchRecentEmails,
  ]);

  const assignments = fetchAssignmentsData.GetAssignments.assignments;

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

  const loading = fetchAssignmentsLoading;

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6 font-sans">
      <NavBar />

      {/* Top Section: User Card + Stats + Calendar */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Left Column: User Card + Stats */}
        <div className="flex flex-col flex-1 gap-4">
          <UserCard />
          {/* Stats Grid */}
          <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="mb-2 w-20 h-3" />
                    <Skeleton className="w-10 h-7" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <StatCard
                  icon={<Clock3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                  label="Pending"
                  value={pending}
                  color="text-amber-600 dark:text-amber-400"
                  onClick={() => router.push("/assignments/@student/assignments-and-quizzes")}
                />
                <StatCard
                  icon={<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  label="Submitted"
                  value={submitted}
                  color="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                  icon={<Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                  label="Graded"
                  value={graded}
                  color="text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                  icon={<XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  label="Missed"
                  value={missed}
                  color="text-red-600 dark:text-red-400"
                />
              </>
            )}
          </div>
        </div>

        {/* Right Column: Calendar */}
        <aside className="flex flex-col gap-3 w-full xl:w-80 shrink-0">
          <WeekCalendar />
          <CalendarEvents />
        </aside>
      </div>

      {/* Middle Section: Assignments + Notifications */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0 border rounded-2xl p-3">
          <AssignmentsCard />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <NotificationsCard />
        </div>
      </div>

      {/* Bottom Section: Courses + Quick Links */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Courses */}
        <div className="flex-1 min-w-0 border rounded-2xl p-4">
          <CourseCard />
        </div>

        {/* Quick Links */}
        <Card className="w-full lg:w-80 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 p-4 pt-0">
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
                className="flex justify-between items-center hover:bg-muted/50 px-3 py-2.5 rounded-lg w-full transition-colors"
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
    </main>
  );
}
