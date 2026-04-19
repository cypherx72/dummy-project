import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function GetTeachingCourses(
  _: any,
  __: any,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: user.id },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        createdAt: true,
        _count: { select: { enrollments: true, assignments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "Teaching courses fetched successfully.",
      code: "TEACHING_COURSES_FETCHED",
      courses: courses.map((c) => ({
        ...c,
        enrolledCount: c._count.enrollments,
        assignmentCount: c._count.assignments,
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "We couldn't fetch your courses. Please try again.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
