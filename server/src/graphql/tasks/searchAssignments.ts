import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function SearchAssignments(
  _: any,
  args: { query: string },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        AND: [
          {
            course: {
              enrollments: { some: { userId: user.id } },
            },
          },
          {
            OR: [
              { title: { contains: args.query, mode: "insensitive" } },
              { description: { contains: args.query, mode: "insensitive" } },
            ],
          },
        ],
      },
      include: {
        course: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true } },
        submissions: { include: { attachments: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 20,
    });

    return {
      status: 200,
      message: "Search results fetched successfully.",
      code: "SEARCH_RESULTS_FETCHED",
      assignments,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "Search failed. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
