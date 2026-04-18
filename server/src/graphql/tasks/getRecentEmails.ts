import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetRecentEmails(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    // Announcements scoped to the user's enrolled courses serve as in-app emails
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [{ courseId: null }, { courseId: { in: courseIds } }],
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      status: 200,
      message: "Recent emails fetched successfully.",
      code: "RECENT_EMAILS_FETCHED",
      emails: announcements.map((a) => ({
        id: a.id,
        subject: a.title,
        senderName: a.creator?.name ?? "System",
        senderEmail: a.creator?.email ?? "no-reply@campus.app",
        preview: a.content.slice(0, 120),
        isRead: false,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "Unable to fetch recent emails. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
