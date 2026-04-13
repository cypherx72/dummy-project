import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

interface AttendanceEntry {
  studentId: string;
  status: "present" | "absent" | "late" | "excused";
  note?: string;
}

export async function SaveAttendance(
  _: any,
  { input }: { input: { courseId: string; date: string; entries: AttendanceEntry[] } },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const date = new Date(input.date);

    // Upsert each student's record
    await Promise.all(
      input.entries.map((entry) =>
        prisma.attendanceRecord.upsert({
          where: {
            courseId_studentId_date: {
              courseId: input.courseId,
              studentId: entry.studentId,
              date,
            },
          },
          update: {
            status: entry.status,
            note: entry.note ?? null,
          },
          create: {
            courseId: input.courseId,
            studentId: entry.studentId,
            date,
            status: entry.status,
            note: entry.note ?? null,
            createdById: user.id,
          },
        }),
      ),
    );

    return {
      status: 200,
      message: "Attendance saved successfully.",
      code: "ATTENDANCE_SAVED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to save attendance.", status: 500, code: "SERVER_ERROR" });
  }
}
