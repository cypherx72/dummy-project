import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetUserCourses(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  console.log(user);

  try {
    const courses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: { userId: user.id },
        },
      },
      include: {
        department: true,
        teacher: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "Courses fetched successfully.",
      code: "COURSES_FETCHED",
      courses: courses.map((c) => ({
        ...c,
        title: c.name, // DashboardCourse GQL type uses 'title', Prisma has 'name'
      })),
    };
  } catch (err) {
    console.log(err);
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "Unable to fetch courses. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
