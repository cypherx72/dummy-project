import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetAssignments(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId: user.id },
          },
        },
      },
      include: {
        course: {
          select: { id: true, name: true, code: true },
        },
        teacher: {
          select: { id: true, name: true },
        },
        submissions: {
          include: { attachments: true },
        },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    });

    return {
      status: 200,
      message: "Assignments fetched successfully.",
      code: "ASSIGNMENTS_FETCHED",
      assignments,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch assignments. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
