import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type fetchSessionDataArgs = {
  input: {
    email: string;
  };
};

export async function FetchSessionData(
  _: any,
  { input }: fetchSessionDataArgs,
  context: contextType
) {
  const { email } = input;
  const { prisma } = context;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw GraphQLCustomLError({
        status: 404,
        code: "USER_NOT_FOUND",
        message:
          "The email provided is not authorized. Please sign in with your university email address (e.g., srn@vupune.ac.in).",
      });
    }

    console.log(user);
    return user;
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message:
        "We couldn't activate your account. Please try again later. If this error persists, please contact our **support team**.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
