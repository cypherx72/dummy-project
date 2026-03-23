import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

export async function GetUserCourses(_: any, __: any, context: contextType) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    const courses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        department: true,
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      status: 200,
      message: "Courses fetched successfully.",
      code: "COURSES_FETCHED",
      courses,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "Unable to fetch courses. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
