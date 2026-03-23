import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { success } from "zod";

type sendMessageArgs = {
  input: {
    chatId: string;
    content?: string;
    media?: string;
    replyToId?: string;
  };
};

export async function SendMessage(
  _: any,
  { input }: sendMessageArgs,
  context: contextType,
) {
  const { prisma, cloudinary, io, req } = context;
  const { media, content, chatId, replyToId } = input;

  const uploadMedia = async (imagePath: string) => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image to cloudinary
      const result = await cloudinary.uploader.upload(imagePath, options);

      const {
        secure_url: cloudinary_url,
        public_id,
        resource_type,
        format,
        display_name,
        bytes,
      } = result;

      console.log(result);
      //Store the media in db
      const media = await prisma.media.create({
        data: {
          cloudinary_url,
          public_id,
          resource_type,
          size: bytes.toString(),
          name: display_name,
          file_extension: format,
          associate: "chat",
        },
      });

      return media;
    } catch (error) {
      console.error("000error");
    }
  };

  try {
    if (!content && !media) {
      //raise graphql error
    }

    const userId = req.user.userId;

    const isChatMember = await prisma.chatMember.findFirst({
      where: { chatId, userId },
      include: { sender: true },
    });

    console.log(isChatMember);
    if (!isChatMember) {
      throw new GraphQLError("Unauthorized");
    }

    let mediaObj: {
      createdAt: string;
      id: string;
      cloudinary_url: string;
      public_id: string;
      resource_type: string;
      size: string;
      name: string;
      file_extension: string;
      associate: string;
    } | null = null;

    if (media) {
      mediaObj = await uploadMedia(media);
    }

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
        where: {
          chatId,
          senderId: { not: isChatMember.sender.id },
        },
        data: {
          unreadMessageCount: { increment: 1 },
        },
      });

      const fullMessage = await tx.message.findUnique({
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
                  name: true,
                  image: true,
                  role: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return fullMessage;
    });

    io.to(`chat:${chatId}`).emit("message:new", result);

    return {
      status: 200,
      message: "Message sent successfully.",
      code: "MESSAGE_SENT",
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
