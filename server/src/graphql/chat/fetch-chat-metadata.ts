import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type fetchChatMetadata = {
  input: {
    userId: string; //todo: ensure that it's not the email used rather the id in the table
  };
};

export async function FetchChatMetadata(
  _: any,
  { input }: fetchChatMetadata,
  context: contextType,
) {
  const { prisma, req } = context;

  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      include: {
        chatMembers: {
          include: {
            chat: {
              include: {
                course: {
                  select: {
                    name: true,
                  },
                },
                messages: {
                  take: 30,
                  orderBy: { createdAt: "desc" },
                  include: {
                    sender: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                      },
                    },
                    media: true,
                    reactions: true,
                  },
                },
                chatMembers: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // todo: return the id of myCursor
    // todo handle here if there is no chat
    // 🔴 IMPORTANT: never return null
    const chats = user?.chatMembers?.map((cm) => cm.chat) ?? [];
    // console.log(chats[0].chatMembers);

    const reversedChats = chats.map((chat) => ({
      ...chat,
      messages: chat.messages.reverse(),
    }));

    console.log(reversedChats);

    console.log();
    return {
      chats: reversedChats,
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
