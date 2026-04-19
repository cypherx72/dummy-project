"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";

export type TeacherAssignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submissions: number;
  priority: string;
};

function parseMs(raw: string): Date {
  const n = Number(raw);
  return isNaN(n) ? new Date(raw) : new Date(n);
}

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-red-100 tesxt-red-700 dark:bg-red-950 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

export const teacherAssignmentColumns: ColumnDef<TeacherAssignment>[] = [
  {
    accessorKey: "title",
    header: () => <Button variant="ghost">Title</Button>,
    cell: ({ row }) => (
      <span className="font-medium text-sm truncate capitalize line-clamp-1">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "course",
    header: () => <Button variant="ghost">Course</Button>,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm capitalize">
        {row.getValue("course")}
      </span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Due Date
        <ArrowUpDown className="ml-2 w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const raw: string = row.getValue("dueDate");
      const due = parseMs(raw);
      const overdue = isPast(due) && !isToday(due);
      const today = isToday(due);
      return (
        <span
          className={cn(
            "font-medium text-xs",
            overdue && "text-red-500",
            today && "text-amber-500",
            !overdue && !today && "text-muted-foreground",
          )}
        >
          {overdue
            ? "Overdue"
            : today
              ? "Due today"
              : format(due, "MMM d, yyyy")}
        </span>
      );
    },
    sortingFn: (a, b) =>
      parseMs(a.getValue("dueDate")).getTime() -
      parseMs(b.getValue("dueDate")).getTime(),
  },
  {
    accessorKey: "submissions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Submissions
        <ArrowUpDown className="ml-2 w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-center">{row.getValue("submissions")}</div>
    ),
  },
  {
    accessorKey: "priority",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority
        <ArrowUpDown className="ml-2 w-4 h-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const p: string = (row.getValue("priority") as string).toLowerCase();
      return (
        <Badge
          className={cn(
            "border-0 text-xs capitalize",
            PRIORITY_BADGE[p] ?? PRIORITY_BADGE.low,
          )}
        >
          {p}
        </Badge>
      );
    },
  },
];
