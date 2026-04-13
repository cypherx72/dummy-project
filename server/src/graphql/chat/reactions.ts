import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth } from "../../lib/guards.js";

type sendReactionArgs = {
  input: { messageId: string; emoji: string; chatId: string };
};

export async function SendReaction(
  _: any,
  { input }: sendReactionArgs,
  context: contextType,
) {
  const { prisma, io, currentUser } = context;
  const user = requireAuth(currentUser);
  const { emoji, messageId, chatId } = input;

  try {
    const sender = await prisma.sender.findUnique({
      where: { userId: user.id },
    });

    if (!sender) throw new GraphQLError("Unauthorized");

    const chatMember = await prisma.chatMember.findUnique({
      where: { chatId_senderId: { chatId, senderId: sender.id } },
    });

    if (!chatMember) throw new GraphQLError("Unauthorized");

    const reaction = await prisma.reaction.create({
      data: { messageId, chatMemberId: chatMember.id, emoji },
    });

    io.to(`chat:${chatId}`).emit("reaction:new", { chatId, messageId, ...reaction });

    return {
      status: 200,
      message: "Reaction sent successfully.",
      code: "REACTION_SENT",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "We couldn't send the reaction. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
