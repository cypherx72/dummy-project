import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function GetTeacherAssignments(
  _: any,
  __: any,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const assignments = await prisma.assignment.findMany({
      where: { createdById: user.id },
      include: {
        course: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true } },
        submissions: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            marksObtained: true,
          },
        },
      },
      orderBy: { postedDate: "desc" },
      take: 20,
    });

    return {
      status: 200,
      message: "Teacher assignments fetched successfully.",
      code: "TEACHER_ASSIGNMENTS_FETCHED",
      assignments,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "We couldn't fetch your assignments. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
