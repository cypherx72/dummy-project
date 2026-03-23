import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

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
    course: {
      name: string;
    };
  };
  unreadMessageCount: string;
};

export async function chatSummary(_: any, __: any, context: contextType) {
  const { prisma, req } = context;

  // check if user does exist
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { sender: true },
  });

  if (!user) {
  }

  // query to fetch chatPreview data
  try {
    const chats = await prisma.chatMember.findMany({
      where: {
        senderId: user.sender.id,
      },

      orderBy: {
        chat: {
          lastMessage: {
            createdAt: "desc",
          },
        },
      },

      select: {
        unreadMessageCount: true,
        chat: {
          select: {
            id: true,
            course: {
              select: { name: true },
            },
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

    console.log(chats);

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
