import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type UnenrollStudentInput = {
  input: { courseId: string; userId?: string };
};

export async function UnenrollStudent(
  _: any,
  { input }: UnenrollStudentInput,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  let targetUserId: string;

  if (user.role === "student") {
    targetUserId = user.id;
  } else {
    targetUserId = input.userId ?? user.id;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: input.courseId },
      select: { id: true, name: true, teacherId: true },
    });

    if (!course) throw new GraphQLError("Course not found.");

    // Teachers can only unenroll from their own courses
    if (user.role === "teacher" && course.teacherId !== user.id) {
      throw new GraphQLError(
        "You can only remove students from your own courses.",
        { extensions: { code: "FORBIDDEN" } },
      );
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: targetUserId, courseId: input.courseId } },
    });

    if (!existing) {
      throw new GraphQLError("This student is not enrolled in this course.");
    }

    await prisma.enrollment.delete({
      where: { userId_courseId: { userId: targetUserId, courseId: input.courseId } },
    });

    return {
      status: 200,
      message: `Successfully unenrolled from ${course.name}.`,
      code: "UNENROLLED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't complete the unenrollment. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
