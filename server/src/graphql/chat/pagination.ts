import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type CursorPaginationArgs = {
  input: { myCursor: string; chatId: string };
};

export async function CursorPagination(
  _: any,
  { input }: CursorPaginationArgs,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  const { myCursor, chatId } = input;

  try {
    const sender = await prisma.sender.findUnique({
      where: { userId: user.id },
    });

    if (!sender) throw new GraphQLError("Unauthorized");

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        chatMembers: { some: { senderId: sender.id } },
      },
      select: {
        id: true,
        chatMembers: {
          where: { senderId: sender.id },
          select: { unreadMessageCount: true },
          take: 1,
        },
        messages: {
          take: 30,
          ...(myCursor && { skip: 1, cursor: { id: myCursor } }),
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            edited: true,
            replyToId: true,
            chatId: true,
            reactions: true,
            messageReceipts: true,
            media: true,
            starredMessages: true,
            pinnedMessages: {
              select: { id: true, messageId: true, pinnedById: true, pinnedAt: true },
            },
            sender: {
              select: {
                id: true,
                user: {
                  select: { id: true, name: true, image: true, role: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!chat) throw new GraphQLError("Chat not found or unauthorized");

    const messages = chat.messages.reverse();

    return {
      chatId: chat.id,
      unreadMessageCount: chat.chatMembers[0]?.unreadMessageCount ?? 0,
      messages,
      nextCursor: messages.length ? messages[0].id : null,
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "Failed to fetch chat messages.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
