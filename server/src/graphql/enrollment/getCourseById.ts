import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";
import { shapeCourse } from "./getDepartments.js";

export async function GetCourseById(
  _: any,
  { id }: { id: string },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  requireAuth(currentUser);

  try {
    const course = await prisma.course.findUnique({
      where: { id },
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
    });

    if (!course) {
      return {
        status: 404,
        message: "Course not found.",
        code: "COURSE_NOT_FOUND",
        course: null,
      };
    }

    return {
      status: 200,
      message: "Course fetched successfully.",
      code: "COURSE_FETCHED",
      course: shapeCourse(course),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch the course. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
