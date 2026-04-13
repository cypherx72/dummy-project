import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetAnnouncements(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    let where: any = {};

    if (user.role === "student") {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);
      where = { OR: [{ courseId: null }, { courseId: { in: courseIds } }] };
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        course: { select: { id: true, name: true, code: true } },
        creator: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return {
      status: 200,
      message: "Announcements fetched successfully.",
      code: "ANNOUNCEMENTS_FETCHED",
      announcements,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to fetch announcements.", status: 500, code: "SERVER_ERROR" });
  }
}
