import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function SaveRemark(
  _: any,
  { input }: { input: { courseId: string; studentId: string; content: string; category?: string; remarkId?: string } },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    let remark;
    if (input.remarkId) {
      remark = await prisma.remark.update({
        where: { id: input.remarkId },
        data: {
          content: input.content,
          category: input.category ?? "general",
        },
      });
    } else {
      remark = await prisma.remark.create({
        data: {
          courseId: input.courseId,
          studentId: input.studentId,
          teacherId: user.id,
          content: input.content,
          category: input.category ?? "general",
        },
      });
    }

    return {
      status: 200,
      message: "Remark saved successfully.",
      code: "REMARK_SAVED",
      remark,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to save remark.", status: 500, code: "SERVER_ERROR" });
  }
}
