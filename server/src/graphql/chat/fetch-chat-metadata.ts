import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type fetchChatMetadata = {
  input: {
    userId: string; //todo: ensure that it's not the email used rather the id in the table
  };
};

export async function FetchChatMetadata(
  _: any,
  { input }: fetchChatMetadata,
  context: contextType
) {
  const { prisma, req } = context;

  // validate token in the req object
  const userId = input.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      include: {
        chatMembers: {
          include: {
            chat: {
              include: {
                messages: {
                  take: 30,
                  orderBy: { createdAt: "asc" },
                },
                chatMembers: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // 🔴 IMPORTANT: never return null
    const chats = user?.chatMembers?.map((cm) => cm.chat) ?? [];

    return {
      chats,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      console.log(err);
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
