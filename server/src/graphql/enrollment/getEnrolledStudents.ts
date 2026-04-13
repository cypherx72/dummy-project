import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function GetEnrolledStudents(
  _: any,
  { courseId }: { courseId: string },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    // Teachers can only see students in their own courses
    if (user.role === "teacher") {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { teacherId: true },
      });

      if (!course) {
        throw new GraphQLError("Course not found.");
      }

      if (course.teacherId !== user.id) {
        throw new GraphQLError(
          "You can only view students enrolled in your own courses.",
          { extensions: { code: "FORBIDDEN" } },
        );
      }
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return {
      status: 200,
      message: "Enrolled students fetched successfully.",
      code: "ENROLLED_STUDENTS_FETCHED",
      enrollments: enrollments.map((e) => ({
        ...e,
        enrolledAt: e.enrolledAt.toISOString(),
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch enrolled students. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
