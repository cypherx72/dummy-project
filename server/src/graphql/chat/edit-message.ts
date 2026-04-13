import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type EditMessageArgs = {
  input: { content: string; messageId: string; chatId: string };
};

export async function EditMessage(
  _: any,
  { input }: EditMessageArgs,
  context: contextType,
) {
  const { prisma, io, currentUser } = context;
  const user = requireAuth(currentUser);
  const { content, messageId, chatId } = input;

  if (!content || !messageId || !chatId) {
    throw new GraphQLError("content, messageId, and chatId are required");
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

    const message = await prisma.message.update({
      data: { content, edited: true },
      where: { id: messageId },
    });

    const messagePayload = { ...message, chatId };

    io.to(`chat:${chatId}`).emit("message:edit", messagePayload);

    return {
      status: 200,
      message: "Message edited successfully.",
      code: "MESSAGE_EDITED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't edit the message. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
