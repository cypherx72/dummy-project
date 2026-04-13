import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";
import { shapeCourse } from "./getDepartments.js";

export async function GetTeacherCourses(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: user.id },
      include: {
        department: {
          select: { id: true, name: true, code: true, createdAt: true },
        },
        teacher: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        enrollments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true, role: true },
            },
          },
          orderBy: { enrolledAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "Teacher courses fetched successfully.",
      code: "TEACHER_COURSES_FETCHED",
      courses: courses.map(shapeCourse),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch your courses. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
