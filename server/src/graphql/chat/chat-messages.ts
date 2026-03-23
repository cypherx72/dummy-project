import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type chatMessagesArgs = {
  input: {
    chatId: string;
  };
};

export async function chatMessages(
  _: any,
  { input }: chatMessagesArgs,
  context: contextType,
) {
  const { prisma, req } = context;

  const chatId = input.chatId;

  // check if user does exist & is part of chat
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { sender: true },
  });

  if (!user) {
  }

  // query to fetch chat data
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        chatMembers: {
          some: {
            senderId: user.sender.id, // ensure user is member
          },
        },
      },
      select: {
        id: true,
        chatMembers: {
          where: {
            senderId: user.sender.id,
          },
          select: {
            unreadMessageCount: true,
          },
          take: 1,
        },
        messages: {
          take: 30,
          orderBy: {
            createdAt: "desc",
          },
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
              select: {
                id: true,
                messageId: true,
                pinnedById: true,
                pinnedAt: true,
              },
            },
            sender: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new GraphQLError("Chat not found or unauthorized");
    }

    const messages = chat.messages.reverse();

    console.log(chat);
    return {
      chatId: chat.id,
      unreadMessageCount: chat.chatMembers[0]?.unreadMessageCount ?? 0,
      messages,
      nextCursor: messages.length ? messages[0].id : null,
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
