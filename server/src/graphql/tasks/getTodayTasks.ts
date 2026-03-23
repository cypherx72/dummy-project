import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

export async function GetTodaysTasks(_: any, __: any, context: contextType) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      status: 200,
      message: "Today's tasks fetched successfully.",
      code: "TODAYS_TASKS_FETCHED",
      tasks,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "We couldn't fetch today's tasks. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
