import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type PinMessageArgs = {
  input: {
    chatId: string;
    messageId: string;
  };
};

export async function PinMessage(
  _: any,
  { input }: PinMessageArgs,
  context: contextType,
) {
  const { prisma, io, req } = context;
  const { chatId, messageId } = input;

  try {
    if (!chatId || !messageId) {
      throw new GraphQLError("chatId and messageId are required");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { sender: true },
    });

    if (!user || !user.sender) {
      throw new GraphQLError("Unauthorized");
    }

    const chatMember = await prisma.chatMember.findUnique({
      where: {
        chatId_senderId: {
          chatId,
          senderId: user.sender.id,
        },
      },
    });

    if (!chatMember) {
      throw new GraphQLError("Unauthorized");
    }

    console.log(chatMember);

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new GraphQLError("Message not found");
    }

    const existingPin = await prisma.pinnedMessage.findUnique({
      where: {
        chatId_messageId: {
          chatId,
          messageId,
        },
      },
    });

    if (existingPin) {
      throw new GraphQLError("Message already pinned");
    }

    const pinnedMessage = await prisma.pinnedMessage.create({
      data: {
        chatId,
        messageId,
        pinnedById: user.sender.id,
      },
      select: {
        chatId: true,
        id: true,
        message: {
          include: {
            pinnedMessages: true,
          },
        },
      },
    });

    io.to(`chat:${chatId}`).emit("message:pin", pinnedMessage);

    return {
      status: 200,
      message: "Message pinned successfully.",
      code: "MESSAGE_PINNED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "Something went wrong while pinning the message.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
