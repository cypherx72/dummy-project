const activities = [
  {
    id: "ACT001",
    activity: "Assignment Submitted",
    user: "Aisha Khan",
    course: "Computer Networks",
    time: "10 mins ago",
  },
  {
    id: "ACT002",
    activity: "New Announcement",
    user: "Prof. Sharma",
    course: "Operating Systems",
    time: "30 mins ago",
  },
  {
    id: "ACT003",
    activity: "Course Registration",
    user: "Rahul Mehta",
    course: "Machine Learning",
    time: "1 hour ago",
  },
  {
    id: "ACT004",
    activity: "Attendance Updated",
    user: "Dr. Patel",
    course: "Data Structures",
    time: "2 hours ago",
  },
  {
    id: "ACT0034",
    activity: "Exam Results Uploaded",
    user: "Admin Office",
    course: "Database Systems",
    time: "Today",
  },
  {
    id: "ACT0012",
    activity: "Exam Results Uploaded",
    user: "Admin Office",
    course: "Database Systems",
    time: "Today",
  },
  {
    id: "ACT0032",
    activity: "Exam Results Uploaded",
    user: "Admin Office",
    course: "Database Systems",
    time: "Today",
  },
  {
    id: "ACT006",
    activity: "Timetable Updated",
    user: "Registrar",
    course: "All Courses",
    time: "Today",
  },
];

const colClass = "px-4 py-3 text-left text-sm";
const cols = [
  { label: "Activity ID", width: "w-[15%]" },
  { label: "Activity", width: "w-[25%]" },
  { label: "User", width: "w-[20%]" },
  { label: "Course", width: "w-[25%]" },
  { label: "Time", width: "w-[15%]" },
];

export function RecentActivityTable() {
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
                  {a.id}
                </td>
                <td
                  className={`${colClass} ${cols[1].width} font-medium text-foreground`}
                >
                  {a.activity}
                </td>
                <td
                  className={`${colClass} ${cols[2].width} text-muted-foreground`}
                >
                  {a.user}
                </td>
                <td
                  className={`${colClass} ${cols[3].width} text-muted-foreground`}
                >
                  {a.course}
                </td>
                <td
                  className={`${colClass} ${cols[4].width} text-muted-foreground`}
                >
                  {a.time}
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
