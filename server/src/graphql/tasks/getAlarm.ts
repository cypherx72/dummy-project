import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetAlarms(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    // Alarms are high-priority unread notifications of type assignment/system
    const alarms = await prisma.notification.findMany({
      where: {
        userId: user.id,
        isRead: false,
        type: { in: ["assignment", "system"] },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      status: 200,
      message: "Alarms fetched successfully.",
      code: "ALARMS_FETCHED",
      alarms: alarms.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "Unable to fetch alarms. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
