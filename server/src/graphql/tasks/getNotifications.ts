import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetNotifications(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      status: 200,
      message: "Notifications fetched successfully.",
      code: "NOTIFICATIONS_FETCHED",
      notifications,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch your notifications. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
