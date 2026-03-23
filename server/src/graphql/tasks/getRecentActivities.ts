import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

export async function GetRecentActivities(
  _: any,
  __: any,
  context: contextType,
) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    const activities = await prisma.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });

    return {
      status: 200,
      message: "Recent activities fetched successfully.",
      code: "RECENT_ACTIVITIES_FETCHED",
      activities,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "We couldn't fetch recent activities. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
