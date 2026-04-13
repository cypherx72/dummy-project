import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type DeleteMessageArgs = {
  input: { chatId: string; messageId: string };
};

export async function DeleteMessage(
  _: any,
  { input }: DeleteMessageArgs,
  context: contextType,
) {
  const { prisma, cloudinary, io, currentUser } = context;
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

    const deletedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { deleted: true },
      include: { media: true },
    });

    if (deletedMessage.media) {
      const { public_id, resource_type } = deletedMessage.media;
      await cloudinary.uploader.destroy(public_id, { resource_type });
    }

    io.to(`chat:${chatId}`).emit("message:delete", deletedMessage);

    await prisma.chatMember.updateMany({
      where: { chatId, senderId: { not: sender.id } },
      data: { unreadMessageCount: { decrement: 1 } },
    });

    return {
      status: 200,
      message: "Message deleted successfully.",
      code: "MESSAGE_DELETED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "Something went wrong while deleting the message.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
