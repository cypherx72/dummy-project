"use client";

import { useEffect, useMemo } from "react";
import { teacherAssignmentColumns, TeacherAssignment } from "./teacherColumns";
import { DataTable } from "./dataTable";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignmentsTableProps {
  assignments: any[];
  loading: boolean;
}

export function AssignmentsTable({
  assignments,
  loading,
}: AssignmentsTableProps) {
  const data: TeacherAssignment[] = useMemo(
    () =>
      assignments.map((a) => ({
        id: a.id,
        title: a.title,
        course: a.course?.name ?? "—",
        dueDate: a.dueDate,
        submissions: a.submissions?.length ?? 0,
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
    <div className="h-full">
      <DataTable columns={teacherAssignmentColumns} data={data} />
    </div>
  );
}
