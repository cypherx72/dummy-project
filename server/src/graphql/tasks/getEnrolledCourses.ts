import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetEnrolledCourses(
  _: any,
  __: any,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const courses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: { userId: user.id },
        },
      },
      include: {
        teacher: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "Enrolled courses fetched successfully.",
      code: "ENROLLED_COURSES_FETCHED",
      courses: courses.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "Unable to fetch enrolled courses. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
