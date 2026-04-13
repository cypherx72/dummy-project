import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type MarkChatAsReadArgs = {
  input: { chatId: string };
};

export async function MarkChatAsRead(
  _: any,
  { input }: MarkChatAsReadArgs,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    const sender = await prisma.sender.findUnique({
      where: { userId: user.id },
    });

    if (!sender) throw new GraphQLError("Unauthorized");

    const { id, unreadMessageCount, chatId } = await prisma.chatMember.update({
      data: { unreadMessageCount: 0 },
      where: {
        chatId_senderId: {
          chatId: input.chatId,
          senderId: sender.id,
        },
      },
    });

    return { chatId, unreadMessageCount, id };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't mark the chat as read. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
