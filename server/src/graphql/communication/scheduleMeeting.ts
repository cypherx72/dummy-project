import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function ScheduleMeeting(
  _: any,
  { input }: { input: any },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const meeting = await prisma.meeting.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        courseId: input.courseId ?? null,
        createdBy: user.id,
        startTime: new Date(input.startTime),
        endTime: input.endTime ? new Date(input.endTime) : null,
        location: input.location ?? null,
        meetingLink: input.meetingLink ?? null,
        type: input.type ?? "class",
      },
      include: {
        course: { select: { id: true, name: true, code: true } },
        creator: { select: { id: true, name: true, image: true } },
      },
    });

    return {
      status: 200,
      message: "Meeting scheduled successfully.",
      code: "MEETING_SCHEDULED",
      meeting,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({ message: "Failed to schedule meeting.", status: 500, code: "SERVER_ERROR" });
  }
}
