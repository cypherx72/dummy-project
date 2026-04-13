import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function CreateQuiz(
  _: any,
  { input }: { input: any },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        courseId: input.courseId,
        createdById: user.id,
        timeLimit: input.timeLimit ?? null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        shuffleQuestions: input.shuffleQuestions ?? false,
        isPublished: input.isPublished ?? false,
        questions: {
          create: (input.questions ?? []).map((q: any, idx: number) => ({
            type: q.type,
            text: q.text,
            marks: q.marks ?? 1,
            options: q.options ?? null,
            correctAnswer: q.correctAnswer ?? null,
            explanation: q.explanation ?? null,
            order: idx,
          })),
        },
      },
      include: { questions: true },
    });

    return {
      status: 200,
      message: "Quiz created successfully.",
      code: "QUIZ_CREATED",
      quiz,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to create quiz.", status: 500, code: "SERVER_ERROR" });
  }
}
