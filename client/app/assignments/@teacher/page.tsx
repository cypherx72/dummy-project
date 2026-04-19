"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { StatCard } from "../_components/statsCard";
import CalendarEvents from "@/app/dashboard/assignments/calendar-events";
import { WeekCalendar } from "@/app/dashboard/assignments/week-calendar";
import NotificationsCard from "@/app/dashboard/assignments/notifications-card";
import UserCard from "../_components/userCard";
import NavBar from "../_components/navBar";

import { RecentAssignmentsTable } from "../_components/recentAssignmentTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Star,
  CalendarDays,
  ArrowRight,
  Plus,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentsTable } from "../_components/assignmentTable";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);

  const {
    fetchTeacherAssignments,
    teacherAssignmentsData,
    teacherAssignmentsLoading,
    fetchNotifications,
    fetchUpcomingEvents,
    fetchAlarms,
    fetchRecentEmails,
    fetchTeachingCourses,
  } = useAssignmentUI();

  useEffect(() => {
    fetchTeacherAssignments();
    fetchNotifications();
    fetchUpcomingEvents();
    fetchAlarms();
    fetchRecentEmails();
    fetchTeachingCourses();
  }, [
    fetchTeacherAssignments,
    fetchNotifications,
    fetchUpcomingEvents,
    fetchAlarms,
    fetchRecentEmails,
    fetchTeachingCourses,
  ]);

  useEffect(() => {
    if (teacherAssignmentsData?.GetTeacherAssignments) {
      setAssignments(
        teacherAssignmentsData.GetTeacherAssignments.assignments ?? [],
      );
    }
  }, [teacherAssignmentsData]);

  const pending = assignments.filter(
    (a) => (a.submissions?.length ?? 0) === 0,
  ).length;
  const submitted = assignments.reduce(
    (acc: number, a: any) =>
      acc +
      (a.submissions?.filter((s: any) => s.status === "submitted").length ?? 0),
    0,
  );
  const graded = assignments.reduce(
    (acc: number, a: any) =>
      acc +
      (a.submissions?.filter((s: any) => s.status === "graded").length ?? 0),
    0,
  );
  const total = assignments.length;

  const loading = teacherAssignmentsLoading;

  return (
    <main className="space-y-6 p-6 font-sans">
      <NavBar />

      <div className="flex gap-4 w-full h-[35lvh]">
        <div className="flex flex-col flex-1 gap-4 h-full">
          <UserCard />
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
                    router.push("/assignments/@teacher/assignments-and-quizzes")
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
                    <ClipboardList className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  }
                  label="Total"
                  value={total}
                  color="text-violet-600 dark:text-violet-400"
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

      {/* Recent Assignments Table + Notifications */}
      {/* Recent Assignments Table + Notifications */}
      <div className="flex flex-row items-start gap-4 h-[45lvh] overflow-hidden">
        <div className="flex flex-col flex-1 gap-3 min-w-0 h-full overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <AssignmentsTable assignments={assignments} loading={loading} />
          </div>
        </div>
        <NotificationsCard />
      </div>

      {/* Bottom row */}
      <div className="flex flex-row gap-4 w-full h-[50lvh] overflow-hidden">
        <div className="flex flex-1 p-4 border-1 rounded-2xl h-full overflow-hidden">
          {/* Reuse CourseCard — shows teacher's courses via GetTeachingCourses */}
          {/* Import the teacher variant or the shared one based on your CourseCard impl */}
          <TeacherCourseShell />
        </div>

        <Card className="w-[28%] h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {[
              {
                label: "Create Assignment",
                href: "/assignments/create-assignment",
                icon: Plus,
                primary: true,
              },
              {
                label: "Create Event",
                href: "/dashboard/events/create",
                icon: CalendarPlus,
                primary: true,
              },
              {
                label: "Assignments & Quizzes",
                href: "/assignments/@teacher/assignments-and-quizzes",
                icon: ClipboardList,
                primary: false,
              },
              {
                label: "Class Schedule",
                href: "/assignments/@teacher/class-schedule",
                icon: CalendarDays,
                primary: false,
              },
              {
                label: "Attendance",
                href: "/assignments/@teacher/attendance",
                icon: CheckCircle2,
                primary: false,
              },
            ].map((item) => (
              <Button
                variant={item.primary ? "default" : "secondary"}
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex justify-between items-center px-3 py-3 rounded-lg w-full transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ArrowRight className="opacity-60 w-3.5 h-3.5" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// ── Inline shell — uses fetchTeachingCourses data already in context ──────────
function TeacherCourseShell() {
  const { teachingCoursesData, teachingCoursesLoading } = useAssignmentUI();
  const courses: any[] = teachingCoursesData?.GetTeachingCourses?.courses ?? [];

  if (teachingCoursesLoading) {
    return (
      <div className="space-y-3 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="rounded-xl w-full h-14" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full overflow-auto">
      <p className="mb-3 font-semibold text-base">My Courses</p>
      {courses.length === 0 ? (
        <p className="text-muted-foreground text-sm">No courses yet.</p>
      ) : (
        courses.map((c: any) => (
          <div
            key={c.id}
            className="flex justify-between items-center bg-muted/30 hover:bg-muted/50 px-4 py-3 rounded-xl transition-colors cursor-default"
          >
            <div>
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-muted-foreground text-xs">{c.code}</p>
            </div>
            <div className="text-muted-foreground text-xs text-right">
              <p>{c.enrolledCount ?? 0} students</p>
              <p>{c.assignmentCount ?? 0} assignments</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
