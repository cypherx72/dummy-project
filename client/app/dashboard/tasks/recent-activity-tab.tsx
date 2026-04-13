"use client";

import { useTaskUI } from "@/context/tasks/task-context";
import { formatDistanceToNow } from "date-fns";

const colClass = "px-4 py-3 text-left text-sm";
const cols = [
  { label: "Activity ID", width: "w-[15%]" },
  { label: "Activity", width: "w-[25%]" },
  { label: "User", width: "w-[20%]" },
  { label: "Course", width: "w-[25%]" },
  { label: "Time", width: "w-[15%]" },
];

export function RecentActivityTable() {
  const { dashboardData, dashboardLoading } = useTaskUI();

  console.log(dashboardData?.GetDashboardData?.activities);
  const activities = (dashboardData?.GetDashboardData?.activities ?? []).map(
    (a) => ({
      ...a,
      createdAt: a.createdAt ? new Date(Number(a.createdAt)) : null,
    }),
  );

  return (
    <div className="bg-card shadow-sm border rounded-xl overflow-hidden text-card-foreground">
      {/* Caption */}
      <div className="bg-muted/30 px-4 py-3 border-b">
        <p className="text-muted-foreground text-sm">
          Recent activity across the campus system.
        </p>
      </div>

      {/* Fixed Header */}
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-muted/50 border-b">
            {cols.map((col) => (
              <th
                key={col.label}
                className={`${colClass} ${col.width} font-medium text-muted-foreground`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* Scrollable Body */}
      <div className="max-h-[35vh] overflow-y-auto no-scrollbar">
        {dashboardLoading && (
          <p className="px-4 py-3 text-muted-foreground text-xs">Loading…</p>
        )}
        {!dashboardLoading && activities.length === 0 && (
          <p className="px-4 py-3 text-muted-foreground text-xs">
            No recent activity.
          </p>
        )}
        <table className="w-full table-fixed">
          <tbody>
            {activities.map((a) => (
              <tr
                key={a.id}
                className="hover:bg-muted/50 last:border-0 border-b transition-colors"
              >
                <td
                  className={`${colClass} ${cols[0].width} font-medium text-foreground`}
                >
                  {a.id.slice(0, 8)}
                </td>
                <td
                  className={`${colClass} ${cols[1].width} font-medium text-foreground`}
                >
                  {a.activity ?? a.type}
                </td>
                <td
                  className={`${colClass} ${cols[2].width} text-muted-foreground`}
                >
                  {a.user?.name ?? "—"}
                </td>
                <td
                  className={`${colClass} ${cols[3].width} text-muted-foreground`}
                >
                  {a.course?.title ?? a.course?.name ?? "—"}
                </td>
                <td
                  className={`${colClass} ${cols[4].width} text-muted-foreground`}
                >
                  {a.createdAt
                    ? formatDistanceToNow(new Date(a.createdAt), {
                        addSuffix: true,
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Footer */}
      <table className="w-full table-fixed">
        <tfoot>
          <tr className="bg-muted/50 border-t">
            <td
              className={`${colClass} ${cols[0].width} font-medium text-foreground`}
            >
              Total Activities
            </td>
            <td className={`${colClass} ${cols[1].width}`} />
            <td className={`${colClass} ${cols[2].width}`} />
            <td className={`${colClass} ${cols[3].width}`} />
            <td
              className={`${colClass} ${cols[4].width} font-medium text-foreground`}
            >
              {activities.length}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
