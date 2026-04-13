import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type EnrollStudentInput = {
  input: { courseId: string; userId?: string };
};

export async function EnrollStudent(
  _: any,
  { input }: EnrollStudentInput,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  // Determine who is being enrolled
  // - Students enroll themselves (input.userId ignored even if passed)
  // - Teachers can enroll someone else into their own course
  // - Admins can enroll anyone into any course
  let targetUserId: string;

  if (user.role === "student") {
    targetUserId = user.id;
  } else if (user.role === "teacher") {
    targetUserId = input.userId ?? user.id;
  } else {
    // admin
    targetUserId = input.userId ?? user.id;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: input.courseId },
      select: { id: true, name: true, teacherId: true },
    });

    if (!course) {
      throw new GraphQLError("Course not found.");
    }

    // Teachers can only enroll students into their own courses
    if (user.role === "teacher" && course.teacherId !== user.id) {
      throw new GraphQLError(
        "You can only enroll students into your own courses.",
        { extensions: { code: "FORBIDDEN" } },
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      throw new GraphQLError("User not found.");
    }

    // Check for duplicate enrollment
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: targetUserId, courseId: input.courseId } },
    });

    if (existing) {
      throw new GraphQLError("This student is already enrolled in this course.");
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId: targetUserId, courseId: input.courseId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    // Log the enrollment activity
    await prisma.activity.create({
      data: {
        userId: targetUserId,
        courseId: input.courseId,
        type: "login", // closest existing ActivityType; extend enum when ready
        description: `Enrolled in ${course.name}`,
      },
    });

    return {
      status: 200,
      message: `Successfully enrolled in ${course.name}.`,
      code: "ENROLLED",
      enrollment: {
        ...enrollment,
        enrolledAt: enrollment.enrolledAt.toISOString(),
      },
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't complete the enrollment. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
