import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type DeleteMessageArgs = {
  input: {
    chatId: string;
    messageId: string;
  };
};

export async function DeleteMessage(
  _: any,
  { input }: DeleteMessageArgs,
  context: contextType,
) {
  const { prisma, cloudinary, io, req } = context;
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

    console.log(user);
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

    const deletedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { deleted: true },
      include: { media: true },
    });

    if (deletedMessage.media) {
      const { publicId, resourceType } = deletedMessage.media;

      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    }

    io.to(`chat:${chatId}`).emit("message:delete", deletedMessage);

    await prisma.chatMember.updateMany({
      where: {
        chatId,
        userId: { not: user.id },
      },
      data: {
        unreadMessageCount: { decrement: 1 },
      },
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
