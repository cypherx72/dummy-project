import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

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

    const user = { id: "1" };

    const isChatMember = await prisma.chatMember.findFirst({
      where: { chatId, userId: user.id },
    });

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

    const result = await prisma.$transaction(async (tx) => {
      // Create message
      const message = await tx.message.create({
        data: {
          chatId,
          senderId: user.id,
          mediaId: mediaObj?.id,
          content,
          replyToId,
        },
      });

      console.log("message", message);

      // Update unread state for other members
      const chatMember = await tx.chatMember.updateManyAndReturn({
        where: {
          chatId,
          userId: { not: user.id },
        },
        data: {
          unreadMessageCount: { increment: 1 },
        },
      });

      console.log("chatmedmb", chatMember);
      // 3️⃣ (Optional) reset sender unread
      // await tx.chatMember.update({
      //   where: {
      //     chatId_userId: {
      //       chatId,
      //       userId: senderId,
      //     },
      //   },
      //   data: {
      //     unreadCount: 0,
      //     lastReadAt: new Date(),
      //   },
      // });

      // 4️⃣ Return what frontend needs
      return {
        message,
        chatMember,
      };
    });

    const messagePayload = {
      ...result.message,
      chatMembers: result.chatMember,
      media: mediaObj
        ? {
            cloudinary_url: mediaObj?.cloudinary_url,
            resource_type: mediaObj?.resource_type,
            createdAt: mediaObj?.createdAt,
            size: mediaObj?.size,
            name: mediaObj?.name,
            associate: mediaObj?.associate,
          }
        : null,
    };

    console.log("mesgds", messagePayload);
    io.to(`chat:${chatId}`).emit("message:new", messagePayload);

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
