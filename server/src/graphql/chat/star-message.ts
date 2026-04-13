import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type StarMessageArgs = {
  input: { chatId: string; messageId: string };
};

export async function StarMessage(
  _: any,
  { input }: StarMessageArgs,
  context: contextType,
) {
  const { prisma, io, currentUser } = context;
  const user = requireAuth(currentUser);
  const { chatId, messageId } = input;

  if (!chatId || !messageId) {
    throw new GraphQLError("chatId and messageId are required");
  }

  try {
    const sender = await prisma.sender.findUnique({
      where: { userId: user.id },
    });

    if (!sender) throw new GraphQLError("Unauthorized");

    const chatMember = await prisma.chatMember.findUnique({
      where: { chatId_senderId: { chatId, senderId: sender.id } },
    });

    if (!chatMember) throw new GraphQLError("Unauthorized");

    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new GraphQLError("Message not found");

    const existingStar = await prisma.starredMessage.findUnique({
      where: { senderId_messageId: { messageId, senderId: sender.id } },
    });

    if (existingStar) throw new GraphQLError("Message already starred");

    const starredMessage = await prisma.starredMessage.create({
      data: { messageId, senderId: sender.id },
      select: { message: { include: { starredMessages: true } } },
    });

    io.to(`user:${user.id}`).emit("message:star", starredMessage);

    return {
      status: 200,
      message: "Message starred successfully.",
      code: "MESSAGE_STARRED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "Something went wrong while starring the message.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
