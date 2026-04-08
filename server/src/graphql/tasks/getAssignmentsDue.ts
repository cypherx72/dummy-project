import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

export async function GetAssignments(_: any, __: any, context: contextType) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { sender: true },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        submissions: {
          include: {
            attachments: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 10,
    });

    console.log("Assignments: ", assignments);
    return {
      status: 200,
      message: "Assignments fetched successfully.",
      code: "ASSIGNMENTS_FETCHED",
      assignments,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "We couldn't fetch assignments. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
