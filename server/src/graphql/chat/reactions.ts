import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type sendReactionArgs = {
  input: {
    messageId: string;
    emoji: string;
    chatId: string;
  };
};

export async function SendReaction(
  _: any,
  { input }: sendReactionArgs,
  context: contextType,
) {
  const { prisma, io, req } = context;
  const { emoji, messageId, chatId } = input;

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

    if (!chatMember) {
      throw new GraphQLError("Unauthorized");
    }

    //Save reaction
    const reaction = await prisma.reaction.create({
      data: {
        messageId,
        chatMemberId: chatMember.id,
        emoji,
      },
    });

    const reactionPayload = {
      chatId,
      messageId,
      ...reaction,
    };

    io.to(`chat:${chatId}`).emit("reaction:new", reactionPayload);

    return {
      status: 200,
      message: "Reaction sent successfully.",
      code: "REACTION_SENT",
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
