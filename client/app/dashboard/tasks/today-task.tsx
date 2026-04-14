"use client";

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssignmentUI } from "@/context/tasks/task-context";
import { format } from "date-fns";

export default function TodaysTasks() {
  const { dashboardData, dashboardLoading } = useAssignmentUI();
  const todayAssignments = (dashboardData as { GetDashboardData?: { todayAssignments?: Array<{ id: string; title: string; dueTime?: string; completed: boolean }> } } | undefined)?.GetDashboardData?.todayAssignments ?? [];

  return (
    <div className="flex flex-col gap-2 py-1 border-none w-full">
      <CardHeader>
        <CardTitle className="font-semibold text-zinc-500 tracking-wide">
          Today&apos;s Tasks
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-0 h-4/5 overflow-hidden overflow-y-auto scroll-py-0.5 no-scrollbar">
        {dashboardLoading && (
          <p className="text-muted-foreground text-xs px-3">Loading…</p>
        )}
        {!dashboardLoading && todayAssignments.length === 0 && (
          <p className="text-muted-foreground text-xs px-3">No tasks for today.</p>
        )}
        {todayAssignments.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center hover:bg-white/5 p-3 border border-white/10 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={task.completed} />

              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{task.title}</p>

                <p className="text-muted-foreground text-xs">
                  {task.dueTime
                    ? format(new Date(task.dueTime), "h:mm a")
                    : "No due time"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
