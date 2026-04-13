import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type LastMessage = {
  content: string;
  createdAt: string;
  senderId: string;
};

type ChatSummary = {
  chat: {
    id: string;
    lastMessage: null | LastMessage;
    imageUrl: string;
    course: { name: string };
  };
  unreadMessageCount: string;
};

export async function chatSummary(_: any, __: any, context: contextType) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);

  try {
    // Get sender record for this user (needed for chatMember lookup)
    const sender = await prisma.sender.findUnique({
      where: { userId: user.id },
    });

    if (!sender) {
      throw new GraphQLError("Sender profile not found");
    }

    const chats = await prisma.chatMember.findMany({
      where: { senderId: sender.id },
      orderBy: {
        chat: { lastMessage: { createdAt: "desc" } },
      },
      select: {
        unreadMessageCount: true,
        chat: {
          select: {
            id: true,
            course: { select: { name: true } },
            imageUrl: true,
            lastMessage: {
              select: {
                content: true,
                createdAt: true,
                senderId: true,
              },
            },
          },
        },
      },
    });

    return {
      chats: chats.map((c: ChatSummary) => ({
        id: c.chat.id,
        imageUrl: c.chat.imageUrl,
        courseName: c.chat.course.name,
        unreadMessageCount: c.unreadMessageCount,
        lastMessage: c.chat.lastMessage
          ? {
              content: c.chat.lastMessage.content,
              createdAt: c.chat.lastMessage.createdAt,
              senderId: c.chat.lastMessage.senderId,
            }
          : null,
      })),
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't load your chats. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
