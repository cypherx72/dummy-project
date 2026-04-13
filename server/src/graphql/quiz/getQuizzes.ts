import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetQuizzes(
  _: any,
  { courseId }: { courseId?: string },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const where: any = {};

    if (user.role === "teacher" || user.role === "admin") {
      if (courseId) where.courseId = courseId;
      else where.createdById = user.id;
    } else {
      // Students: only see quizzes for their enrolled courses
      where.isPublished = true;
      if (courseId) {
        where.courseId = courseId;
      } else {
        const enrollments = await prisma.enrollment.findMany({
          where: { userId: user.id },
          select: { courseId: true },
        });
        where.courseId = { in: enrollments.map((e) => e.courseId) };
      }
    }

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        questions: { orderBy: { order: "asc" } },
        course: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      message: "Quizzes fetched successfully.",
      code: "QUIZZES_FETCHED",
      quizzes,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to fetch quizzes.", status: 500, code: "SERVER_ERROR" });
  }
}
