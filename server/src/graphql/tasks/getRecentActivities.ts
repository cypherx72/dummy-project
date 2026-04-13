import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetRecentActivities(
  _: any,
  __: any,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  requireAuth(currentUser);

  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: { id: true, name: true },
        },
        course: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    return {
      status: 200,
      message: "Recent activities fetched successfully.",
      code: "RECENT_ACTIVITIES_FETCHED",
      activities: activities.map((a) => ({
        ...a,
        activity: a.type, // GQL RecentActivity.activity maps from Prisma's type enum
      })),
    };
  } catch (err) {
    console.log(err);
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch recent activities. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
