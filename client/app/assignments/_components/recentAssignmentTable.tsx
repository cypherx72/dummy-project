"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowRight,
  Search,
  ClipboardList,
  Plus,
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";

type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  priority?: string;
  submissionType?: string;
  maxMarks?: number;
  course?: { id: string; name: string };
  submissions?: { id: string; status: string }[];
};

type SortKey = "title" | "course" | "dueDate" | "submissions" | "priority";
type SortDir = "asc" | "desc";

function parseMs(raw: string): Date {
  const n = Number(raw);
  return isNaN(n) ? new Date(raw) : new Date(n);
}

function getDueLabel(raw: string): { label: string; color: string } {
  const due = parseMs(raw);
  if (isPast(due) && !isToday(due))
    return { label: "Overdue", color: "text-red-500" };
  if (isToday(due)) return { label: "Due today", color: "text-amber-500" };
  return { label: format(due, "MMM d, yyyy"), color: "text-muted-foreground" };
}

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

interface RecentAssignmentsTableProps {
  assignments: Assignment[];
  loading: boolean;
}

export function RecentAssignmentsTable({
  assignments,
  loading,
}: RecentAssignmentsTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = assignments
    .filter((a) => {
      const q = filter.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        (a.course?.name ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "course")
        cmp = (a.course?.name ?? "").localeCompare(b.course?.name ?? "");
      else if (sortKey === "dueDate")
        cmp = parseMs(a.dueDate).getTime() - parseMs(b.dueDate).getTime();
      else if (sortKey === "submissions")
        cmp = (a.submissions?.length ?? 0) - (b.submissions?.length ?? 0);
      else if (sortKey === "priority")
        cmp = (a.priority ?? "").localeCompare(b.priority ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

  function SortButton({
    col,
    children,
  }: {
    col: SortKey;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={() => toggleSort(col)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {children}
        <ArrowUpDown
          className={cn(
            "w-3 h-3",
            sortKey === col ? "text-foreground" : "text-muted-foreground/50",
          )}
        />
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter row */}
      <div className="relative w-full max-w-sm">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
        <Input
          placeholder="Filter assignments..."
          className="pl-9 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[38%]">
                <SortButton col="title">Title</SortButton>
              </TableHead>
              <TableHead className="w-[22%]">
                <SortButton col="course">Course</SortButton>
              </TableHead>
              <TableHead className="w-[16%]">
                <SortButton col="dueDate">Due Date</SortButton>
              </TableHead>
              <TableHead className="w-[12%]">
                <SortButton col="submissions">Submissions</SortButton>
              </TableHead>
              <TableHead className="w-[12%]">
                <SortButton col="priority">Priority</SortButton>
              </TableHead>
              <TableHead className="w-[8%]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="w-full h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-muted-foreground text-sm text-center"
                >
                  s
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardList className="w-8 h-8 text-muted-foreground/40" />
                    {filter
                      ? `No results for "${filter}"`
                      : "No assignments yet."}
                    {!filter && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1"
                        onClick={() =>
                          router.push("/assignments/create-assignment")
                        }
                      >
                        <Plus className="mr-1.5 w-3.5 h-3.5" />
                        Create first assignment
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => {
                const due = getDueLabel(a.dueDate);
                const submissionCount = a.submissions?.length ?? 0;
                const priority = a.priority?.toLowerCase() ?? "low";
                return (
                  <TableRow
                    key={a.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        "/assignments/@teacher/assignments-and-quizzes",
                      )
                    }
                  >
                    <TableCell className="font-medium text-sm">
                      {a.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {a.course?.name ?? "—"}
                    </TableCell>
                    <TableCell className={cn("font-medium text-xs", due.color)}>
                      {due.label}
                    </TableCell>
                    <TableCell className="text-sm text-center">
                      {submissionCount}
                    </TableCell>
                    <TableCell>
                      {a.priority ? (
                        <Badge
                          className={cn(
                            "border-0 text-xs capitalize",
                            PRIORITY_BADGE[priority] ?? PRIORITY_BADGE.low,
                          )}
                        >
                          {a.priority}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Showing {filtered.length} of {assignments.length} assignments
        </p>
      )}
    </div>
  );
}
