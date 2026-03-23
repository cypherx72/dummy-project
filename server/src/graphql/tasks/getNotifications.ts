import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

export async function GetNotifications(_: any, __: any, context: contextType) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return {
      status: 200,
      message: "Notifications fetched successfully.",
      code: "NOTIFICATIONS_FETCHED",
      notifications,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "We couldn't fetch your notifications. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
