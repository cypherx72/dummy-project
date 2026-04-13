import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function GetRemarks(
  _: any,
  { courseId }: { courseId: string },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const remarks = await prisma.remark.findMany({
      where: { courseId, teacherId: user.id },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "Remarks fetched successfully.",
      code: "REMARKS_FETCHED",
      remarks,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to fetch remarks.", status: 500, code: "SERVER_ERROR" });
  }
}
