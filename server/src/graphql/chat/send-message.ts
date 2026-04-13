import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type sendMessageArgs = {
  input: { chatId: string; content?: string; media?: string; replyToId?: string };
};

export async function SendMessage(
  _: any,
  { input }: sendMessageArgs,
  context: contextType,
) {
  const { prisma, cloudinary, io, currentUser } = context;
  const user = requireAuth(currentUser);
  const { media, content, chatId, replyToId } = input;

  const uploadMedia = async (imagePath: string) => {
    try {
      const result = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      const {
        secure_url: cloudinary_url,
        public_id,
        resource_type,
        format,
        display_name,
        bytes,
      } = result;

      return await prisma.media.create({
        data: {
          cloudinary_url,
          public_id,
          resource_type,
          bytes,
          name: display_name,
          file_extension: format,
          associate: "chat",
        },
      });
    } catch (error) {
      console.error("Media upload failed:", error);
      return null;
    }
  };

  if (!content && !media) {
    throw new GraphQLError("A message must have content or media.");
  }

  try {
    const isChatMember = await prisma.chatMember.findFirst({
      where: {
        chatId,
        sender: { userId: user.id },
      },
      include: { sender: true },
    });

    if (!isChatMember) throw new GraphQLError("Unauthorized");

    const mediaObj = media ? await uploadMedia(media) : null;

    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      const createdMessage = await tx.message.create({
        data: {
          chatId,
          senderId: isChatMember.sender.id,
          mediaId: mediaObj?.id,
          content,
          replyToId,
        },
      });

      await tx.chat.update({
        where: { id: chatId },
        data: { lastMessageId: createdMessage.id },
      });

      await tx.chatMember.updateMany({
        where: { chatId, senderId: { not: isChatMember.sender.id } },
        data: { unreadMessageCount: { increment: 1 } },
      });

      return tx.message.findUnique({
        where: { id: createdMessage.id },
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
      });
    });

    io.to(`chat:${chatId}`).emit("message:new", result);

    return {
      status: 200,
      message: "Message sent successfully.",
      code: "MESSAGE_SENT",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't send the message. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
