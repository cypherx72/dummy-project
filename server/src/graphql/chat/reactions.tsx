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
  const { prisma, io } = context;
  const { emoji, messageId, chatId } = input;

  console.log(emoji, messageId, chatId);
  try {
    if (!emoji || !messageId || !chatId) {
      //raise graphql error
    }

    const user = { id: "1" }; // fetch this from context

    const chatMember = await prisma.chatMember.findFirst({
      where: { chatId, userId: user.id },
    });

    if (!chatMember) {
      throw new GraphQLError("Unauthorized");
    }

    //Save message
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
