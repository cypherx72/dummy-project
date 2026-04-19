"use client";

import { useMemo } from "react";
import { isPast, isToday } from "date-fns";
import { StudentAssingmentColumns, StudentAssignment } from "./columns";
import { DataTable } from "../dataTable";
import { Skeleton } from "@/components/ui/skeleton";

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

interface StudentAssignmentsTableProps {
  assignments: any[];
  loading: boolean;
}

export function StudentAssignmentsTable({
  assignments,
  loading,
}: StudentAssignmentsTableProps) {
  const data: StudentAssignment[] = useMemo(
    () =>
      assignments.map((a) => ({
        id: a.id,
        title: a.title,
        course: a.course?.name ?? "—",
        dueDate: a.dueDate,
        status: getStatus(a),
        priority: a.priority ?? "low",
      })),
    [assignments],
  );

  if (loading) {
    return (
      <div className="space-y-2 h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="rounded-md w-full h-10" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-auto">
      <DataTable columns={StudentAssingmentColumns} data={data} />
    </div>
  );
}
