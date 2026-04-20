"use client";
import { StudentAssignmentsTable } from "../../_components/students/table";
import { useState, useEffect } from "react";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { isPast, isToday } from "date-fns";
import { StatCard } from "../../_components/statsCard";
import { XCircle, Clock3, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentProgress } from "@/app/dashboard/tasks/course-card";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { BookText } from "lucide-react";

function parseMs(raw: string): Date {
  const n = Number(raw);
  return isNaN(n) ? new Date(raw) : new Date(n);
}

function getStatus(a: any): string {
  const sub = a.submissions?.[0];
  if (sub) return sub.status;
  const due = parseMs(a.dueDate);
  return isPast(due) && !isToday(due) ? "missed" : "pending";
}

export default function Page() {
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);

  const { fetchAssignments, fetchAssignmentsData, fetchAssignmentsLoading } =
    useAssignmentUI();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (fetchAssignmentsData?.GetAssignments) {
      setAssignments(fetchAssignmentsData.GetAssignments.assignments);
    }
  }, [fetchAssignmentsData]);

  const loading = fetchAssignmentsLoading;

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
  const total = assignments.length;
  const pct = total > 0 ? Math.round(((submitted + graded) / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 p-6 h-full overflow-auto">
      {/* ── Header banner ── */}
      <div className="relative border-0 rounded-2xl w-full h-sm">
        <div className="z-0 absolute inset-0 rounded-2xl dark-horizon-glow" />
        <Card className="justify-start p-0 font-sans">
          <div className="z-20 relative flex flex-col justify-evenly space-y-5 bg-black/10 backdrop-blur-sm px-3 py-4 rounded-2xl w-full h-full">
            <CardHeader className="space-y-2 p-0">
              <CardTitle className="font-medium text-white text-lg truncate capitalize">
                My Assignements
              </CardTitle>
              <CardDescription className="space-y-2 font-light text-zinc-200 text-sm tracking-wide">
                <p className="text-zinc-300 line-clamp-2">
                  Stay on top of your coursework. Track upcoming deadlines,
                  monitor your progress, and complete assignments on time.
                </p>
                <span className="flex flex-row items-center space-x-1 p-0 text-zinc-500">
                  <BookText className="size-6" />
                  <p className="text-xs uppercase">BS Computer Science</p>
                </span>
                <AssignmentProgress />
              </CardDescription>
            </CardHeader>
          </div>
        </Card>
      </div>

      {/* ── Stat cards ── */}
      <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 h-sm">
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
                router.push("/assignments/student/assignments-and-quizzes")
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

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <StudentAssignmentsTable
          assignments={assignments}
          loading={fetchAssignmentsLoading}
        />
      </div>
    </div>
  );
}
