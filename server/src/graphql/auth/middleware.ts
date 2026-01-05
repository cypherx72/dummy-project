import { type contextType } from "../../lib/types.js";
import { GraphQLError } from "graphql";
import { GraphQLCustomLError } from "../../lib/error.js";
import { getSessionId } from "../../lib/auth.js";

export const Middleware = async (
  _: any,
  _input: undefined,
  { prisma, req }: contextType
) => {
  try {
    const { sessionId } = await getSessionId(req);
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      throw GraphQLCustomLError({
        message:
          "Your session for this action is no longer active. Please start the activation process again.",
        status: 403,
        code: "TOKEN_NOT_FOUND",
      });
    }

    return {
      message: "",
      status: 200,
      code: "TOKEN_VALID",
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message: "Something went wrong.",
      code: "SERVER_ERROR",
      status: 500,
    });
  }
};
