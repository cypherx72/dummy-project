import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type sendMessageArgs = {
  input: {
    chatId: string;
    messageId: string;
  };
};

export async function SendMessage(
  _: any,
  { input }: sendMessageArgs,
  context: contextType,
) {
  const { prisma, cloudinary, io, req } = context;
  const { chatId, messageId } = input;

  type DeleteMediaArgs = {
    publicId: string;
    resourceType: string;
  };
  const deleteMedia = async ({ publicId, resourceType }: DeleteMediaArgs) => {
    try {
      // delete the media from cloudinary
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      console.log(result);

      return result;
    } catch (error) {
      console.error("000error");
    }
  };

  try {
    if (!chatId && !messageId) {
      //raise graphql error
    }

    const user = { id: "1" };

    const isChatMember = await prisma.chatMember.findFirst({
      where: { chatId, userId: user.id },
    });

    if (!isChatMember) {
      throw new GraphQLError("Unauthorized");
    }

    // fetch data from db
    const message = await prisma.message.find({
      where: {
        id: messageId,
      },
      include: {
        media: true,
      },
    });

    if (message.media) {
      const result = await deleteMedia({});
      const { publicId, resourceType } = message.media;

      if (result.result.ok) {
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // delete message
      const message = await tx.message.delete({
        where: {
          id: messageId,
        },
      });

      console.log("deleted message", message);

      // Update unread state for other members

      //   const chatMember = await tx.chatMember.updateMany({
      //     where: {
      //       chatId,
      //       userId: { not: user.id },
      //     },
      //     data: {
      //       unreadMessageCount: { increment: 1 },
      //     },
      //   });

      //   console.log("chatmedmb", chatMember);

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
    });

    io.to(`chat:${chatId}`).emit("message:delete", messageId);

    return {
      status: 200,
      message: "Message deleted successfully.",
      code: "MESSAGE_DELETED",
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
