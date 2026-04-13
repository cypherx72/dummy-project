import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetUpcomingEvents(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  requireAuth(currentUser);

  try {
    const now = new Date();

    const events = await prisma.event.findMany({
      where: {
        startTime: { gte: now },
      },
      orderBy: { startTime: "asc" },
      take: 10,
    });

    return {
      status: 200,
      message: "Events fetched successfully.",
      code: "EVENTS_FETCHED",
      events: events.map((e) => ({
        ...e,
        startDate: e.startTime.toISOString(),
        startTime: e.startTime.toISOString(),
      })),
    };
  } catch (err) {
    console.log(err);
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch upcoming events. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
