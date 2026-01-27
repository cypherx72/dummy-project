import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type MarkChatAsReadArgs = {
  input: {
    chatId: string;
  };
};

export async function MarkChatAsRead(
  _: any,
  { input }: MarkChatAsReadArgs,
  context: contextType,
) {
  const { prisma, req } = context;

  try {
    const user = { id: "1" };

    const { id, unreadMessageCount, chatId } = await prisma.chatMember.update({
      data: {
        unreadMessageCount: 0,
      },
      where: {
        chatId_userId: {
          chatId: input.chatId,
          userId: user.id,
        },
      },
    });

    return {
      chatId,
      unreadMessageCount,
      id,
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
