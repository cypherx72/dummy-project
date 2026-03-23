import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type EditMessageArgs = {
  input: {
    content: string;
    messageId: string;
    chatId: string;
  };
};

export async function EditMessage(
  _: any,
  { input }: EditMessageArgs,
  context: contextType,
) {
  const { prisma, io, req } = context;
  const { content, messageId, chatId } = input;

  console.log(content);

  if (!content || !messageId || !chatId)
    return {
      // raise graphql error
    };

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { sender: true },
    });

    const chatMember = await prisma.chatMember.findUnique({
      where: {
        chatId_senderId: {
          chatId,
          senderId: user.sender.id,
        },
      },
    });
    console.log("found mebmer: ", chatMember);

    if (!chatMember) {
      throw new GraphQLError("Unauthorized");
    }

    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      // update message
      const message = await tx.message.update({
        data: {
          senderId: user.id,
          content,
          edited: true,
        },
        where: {
          id: messageId,
        },
      });

      console.log("message", message);

      return {
        message,
      };
    });

    const messagePayload = {
      ...result.message,
      ...result.chatMember,
    };

    console.log("edited message", messagePayload);
    io.to(`chat:${messagePayload.chatId}`).emit("message:edit", messagePayload);

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
