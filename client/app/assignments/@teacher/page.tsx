"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { useSession } from "@/context/session-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  BookOpen,
  Bell,
  Clock3,
  Plus,
  CheckCircle2,
  Star,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Users,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { format, isPast, isToday, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type AssignmentStatus = "pending" | "submitted" | "graded" | "late" | "missed";

function parseMs(raw: string): Date {
  const n = Number(raw);
  return isNaN(n) ? new Date(raw) : new Date(n);
}

const STATUS_CFG: Record<
  AssignmentStatus,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock3 className="w-3 h-3" />,
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  submitted: {
    label: "Submitted",
    icon: <CheckCircle2 className="w-3 h-3" />,
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  graded: {
    label: "Graded",
    icon: <Star className="w-3 h-3" />,
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  late: {
    label: "Late",
    icon: <AlertTriangle className="w-3 h-3" />,
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  },
  missed: {
    label: "Missed",
    icon: <XCircle className="w-3 h-3" />,
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
};

export default function TeacherAssignmentsPage() {
  const router = useRouter();
  const { user } = useSession();
  const {
    fetchDashboardData,
    dashboardData,
    dashboardLoading,
  } = useAssignmentUI();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const assignments = dashboardData?.GetDashboardData?.assignments ?? [];
  const courses = dashboardData?.GetDashboardData?.courses ?? [];
  const notifications = dashboardData?.GetDashboardData?.notifications ?? [];
  const activities = dashboardData?.GetDashboardData?.activities ?? [];
  const todayAssignments = dashboardData?.GetDashboardData?.todayAssignments ?? [];

  // Stats derived from assignments
  const totalAssignments = assignments.length;
  const dueToday = assignments.filter((a: any) => {
    const d = parseMs(a.dueDate);
    return isToday(d);
  }).length;
  const overdue = assignments.filter((a: any) => {
    const d = parseMs(a.dueDate);
    return isPast(d) && !isToday(d);
  }).length;
  const activeCourses = courses.length;

  const StatCard = ({
    icon,
    label,
    value,
    sub,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    sub?: string;
    color: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              {label}
            </p>
            <p className={cn("mt-1 font-bold text-3xl", color)}>{value}</p>
            {sub && (
              <p className="mt-0.5 text-muted-foreground text-xs">{sub}</p>
            )}
          </div>
          <div className={cn("p-2.5 rounded-xl", color.replace("text-", "bg-").replace("-600", "-100").replace("-400", "-950/30"))}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">
            {dashboardLoading ? (
              <Skeleton className="w-48 h-7" />
            ) : (
              <>Welcome back, {user?.name?.split(" ")[0] ?? "Teacher"} 👋</>
            )}
          </h1>
          <p className="mt-0.5 text-muted-foreground text-sm">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>
        <Button
          onClick={() => router.push("/assignments/create-assignment")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </Button>
      </div>

      {/* Stats row */}
      <div className="gap-4 grid grid-cols-2 lg:grid-cols-4">
        {dashboardLoading ? (
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
              icon={<ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              label="Total Assignments"
              value={totalAssignments}
              sub="All posted"
              color="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              label="Active Courses"
              value={activeCourses}
              sub="Enrolled classes"
              color="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              icon={<CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              label="Due Today"
              value={dueToday}
              sub="Assignments"
              color="text-amber-600 dark:text-amber-400"
            />
            <StatCard
              icon={<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
              label="Overdue"
              value={overdue}
              sub="Need attention"
              color="text-red-600 dark:text-red-400"
            />
          </>
        )}
      </div>

      {/* Main grid */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Assignments list (2/3 width) */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Recent Assignments</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() =>
                    router.push("/assignments/@teacher/assignments-and-quizzes")
                  }
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {dashboardLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-14" />
                ))
              ) : assignments.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-10 text-center">
                  <ClipboardList className="mb-2 w-8 h-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">
                    No assignments yet.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() =>
                      router.push("/assignments/create-assignment")
                    }
                  >
                    <Plus className="mr-1.5 w-3.5 h-3.5" />
                    Create first assignment
                  </Button>
                </div>
              ) : (
                assignments.slice(0, 6).map((a: any) => {
                  const due = parseMs(a.dueDate);
                  const isOverdue = isPast(due) && !isToday(due);
                  return (
                    <div
                      key={a.id}
                      className="flex justify-between items-center hover:bg-muted/40 px-3 py-3 rounded-lg transition-colors cursor-pointer"
                      onClick={() => router.push(`/assignments/@teacher/assignments-and-quizzes`)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex justify-center items-center bg-muted rounded-md w-9 h-9 shrink-0">
                          <ClipboardList className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {a.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {a.course?.name ?? "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span
                          className={cn(
                            "text-xs",
                            isOverdue
                              ? "text-red-500"
                              : isToday(due)
                              ? "text-amber-500"
                              : "text-muted-foreground",
                          )}
                        >
                          {isOverdue
                            ? "Overdue"
                            : isToday(due)
                            ? "Due today"
                            : formatDistanceToNow(due, { addSuffix: true })}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Courses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Courses</CardTitle>
            </CardHeader>
            <CardContent className="gap-3 grid grid-cols-1 sm:grid-cols-2 p-4 pt-0">
              {dashboardLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))
              ) : courses.length === 0 ? (
                <p className="col-span-2 py-8 text-center text-muted-foreground text-sm">
                  No courses assigned yet.
                </p>
              ) : (
                courses.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 hover:bg-muted/40 p-3 border rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      router.push("/assignments/@teacher/class-schedule")
                    }
                  >
                    <div className="flex justify-center items-center bg-emerald-100 dark:bg-emerald-950/40 rounded-lg w-10 h-10 shrink-0">
                      <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{c.name}</p>
                      <p className="text-muted-foreground text-xs">{c.code}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-4">
          {/* Today's tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today&apos;s Tasks</CardTitle>
              <CardDescription>
                {todayAssignments.length} tasks scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {dashboardLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))
              ) : todayAssignments.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground text-xs">
                  No tasks today 🎉
                </p>
              ) : (
                todayAssignments.slice(0, 5).map((t: any) => (
                  <div
                    key={t.id}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md",
                      t.completed
                        ? "opacity-50"
                        : "bg-muted/30",
                    )}
                  >
                    <CheckCircle2
                      className={cn(
                        "w-4 h-4 shrink-0",
                        t.completed
                          ? "text-emerald-500"
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm flex-1 truncate",
                        t.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {t.title}
                    </span>
                    {t.dueTime && (
                      <span className="text-muted-foreground text-xs shrink-0">
                        {format(parseMs(t.dueTime), "HH:mm")}
                      </span>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Notifications</CardTitle>
                {notifications.filter((n: any) => !n.isRead).length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {notifications.filter((n: any) => !n.isRead).length} new
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {dashboardLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))
              ) : notifications.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground text-xs">
                  No notifications
                </p>
              ) : (
                notifications.slice(0, 4).map((n: any) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 px-2 py-2 rounded-md"
                  >
                    <Bell className="mt-0.5 w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate">{n.title}</p>
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              {dashboardLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="rounded-full w-7 h-7 shrink-0" />
                    <Skeleton className="flex-1 h-8" />
                  </div>
                ))
              ) : activities.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground text-xs">
                  No recent activity
                </p>
              ) : (
                activities.slice(0, 4).map((act: any) => (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className="text-[10px]">
                        {act.user?.name?.[0] ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs leading-snug">
                        <span className="font-medium">
                          {act.user?.name ?? "Someone"}
                        </span>{" "}
                        {act.description}
                      </p>
                      <p className="mt-0.5 text-muted-foreground text-[10px]">
                        {act.course?.name && `${act.course.name} · `}
                        {formatDistanceToNow(new Date(Number(act.createdAt)), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
