import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

export async function GetTodaysTasks(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        dueTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        dueTime: "asc",
      },
    });

    return {
      status: 200,
      message: "Today's tasks fetched successfully.",
      code: "TODAYS_TASKS_FETCHED",
      tasks,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't fetch today's tasks. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
