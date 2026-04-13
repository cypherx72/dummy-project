import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function CreateAnnouncement(
  _: any,
  { input }: { input: { title: string; content: string; courseId?: string; priority?: string } },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const announcement = await prisma.announcement.create({
      data: {
        title: input.title,
        content: input.content,
        courseId: input.courseId ?? null,
        createdBy: user.id,
        priority: input.priority ?? "normal",
      },
      include: {
        course: { select: { id: true, name: true, code: true } },
        creator: { select: { id: true, name: true, image: true } },
      },
    });

    return {
      status: 200,
      message: "Announcement created successfully.",
      code: "ANNOUNCEMENT_CREATED",
      announcement,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to create announcement.", status: 500, code: "SERVER_ERROR" });
  }
}
