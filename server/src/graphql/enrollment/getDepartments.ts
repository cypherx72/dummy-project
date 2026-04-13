import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

// Shared course shape builder — reused by all enrollment resolvers
export function shapeCourse(course: any) {
  return {
    ...course,
    createdAt: course.createdAt instanceof Date
      ? course.createdAt.toISOString()
      : course.createdAt,
    enrolledStudents: (course.enrollments ?? []).map((e: any) => ({
      ...e,
      enrolledAt: e.enrolledAt instanceof Date
        ? e.enrolledAt.toISOString()
        : e.enrolledAt,
    })),
    enrolledCount: course.enrollments?.length ?? 0,
  };
}

export async function GetDepartments(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  requireAuth(currentUser);

  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        courses: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true, image: true, role: true },
            },
            enrollments: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true, role: true },
                },
              },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    });

    return {
      status: 200,
      message: "Departments fetched successfully.",
      code: "DEPARTMENTS_FETCHED",
      departments: departments.map((dept) => ({
        ...dept,
        createdAt: dept.createdAt.toISOString(),
        courses: dept.courses.map(shapeCourse),
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch departments. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
