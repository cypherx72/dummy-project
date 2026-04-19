"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { AssignmentsTable } from "../_components/assignmentTable";

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
  const [assignments, setAssignments] = useState([]);

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

  useEffect(() => {
    if (fetchAssignmentsData?.GetAssignments) {
      const assignments = fetchAssignmentsData.GetAssignments.assignments;
      setAssignments(assignments);
    }
  }, [fetchAssignmentsData]);

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

  // const upcoming = [...assignments]
  //   .filter((a: any) => {
  //     const s = getStatus(a);
  //     return s === "pending" || s === "late";
  //   })
  //   .sort(
  //     (a: any, b: any) =>
  //       parseMs(a.dueDate).getTime() - parseMs(b.dueDate).getTime(),
  //   )
  //   .slice(0, 5);

  // Recent grades

  // const recentGrades = assignments
  //   .filter((a: any) => getStatus(a) === "graded")
  //   .slice(0, 3);

  const loading = fetchAssignmentsLoading;

  return (
    <main className="space-y-6 p-6 font-sans">
      <NavBar />

      <div className="flex gap-4 w-full h-[35lvh]">
        <div className="flex flex-col flex-1 gap-4 h-full">
          <UserCard />
          {/* Stats */}
          <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 h-full">
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

        <section className="flex flex-col gap-2 p-2 border-1 rounded-2xl w-[28%]">
          <WeekCalendar />
          <CalendarEvents />
        </section>
      </div>

      <div className="flex flex-row justify-start items-start gap-4 h-[45lvh] overflow-hidden">
        <AssignmentsTable />
        <NotificationsCard />
      </div>

      {/* Right column */}
      <div className="flex flex-row gap-4 space-y-4 w-full h-[50lvh] overflow-hidden">
        {/* Notifications */}
        <div className="flex flex-1 p-4 border-1 rounded-2xl h-full overflow-hidden">
          <CourseCard />
        </div>
        {/* Quick links */}
        <Card className="w-[28%] h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
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
              {
                label: "Create Assingment",
                href: "/dashboard/create-assignment",
                icon: Star,
              },
            ].map((item) => (
              <Button
                variant="secondary"
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex justify-between items-center hover:bg-muted/40 px-3 py-3 rounded-lg w-full transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
