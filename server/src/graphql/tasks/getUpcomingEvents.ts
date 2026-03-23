import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

export async function GetUpcomingEvents(_: any, __: any, context: contextType) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    const now = new Date();
    console.log(now);
    const events = await prisma.event.findMany({
      where: {
        startTime: {
          gte: now,
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: 10,
    });

    return {
      status: 200,
      message: "Events fetched successfully.",
      code: "EVENTS_FETCHED",
      events,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "We couldn't fetch upcoming events. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
