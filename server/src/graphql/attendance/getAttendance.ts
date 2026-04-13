import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function GetCourseAttendance(
  _: any,
  { courseId, date }: { courseId: string; date?: string },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    // Get enrolled students for this course
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true, role: true } },
      },
      orderBy: { enrolledAt: "asc" },
    });

    // Get existing records for the given date (or today)
    const targetDate = date ? new Date(date) : new Date();
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const records = await prisma.attendanceRecord.findMany({
      where: {
        courseId,
        date: { gte: dayStart, lte: dayEnd },
      },
    });

    const recordMap = new Map(records.map((r) => [r.studentId, r]));

    const students = enrollments.map((e) => {
      const record = recordMap.get(e.user.id);
      return {
        userId: e.user.id,
        name: e.user.name,
        email: e.user.email,
        image: e.user.image,
        status: record?.status ?? "present",
        note: record?.note ?? "",
        recordId: record?.id ?? null,
      };
    });

    return {
      status: 200,
      message: "Attendance fetched successfully.",
      code: "ATTENDANCE_FETCHED",
      students,
      date: dayStart.toISOString(),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to fetch attendance.", status: 500, code: "SERVER_ERROR" });
  }
}
