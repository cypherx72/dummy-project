import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";

type CursorPaginationArgs = {
  input: {
    myCursor: string;
    activeChatId: string;
  };
};

export async function CursorPagination(
  _: any,
  { input }: CursorPaginationArgs,
  context: contextType,
) {
  const { prisma, req } = context;
  const { myCursor, activeChatId } = input;
  console.log("..ffd");

  const usr = { id: "1" };

  try {
    const chatMember = await prisma.chatMember.findFirst({
      where: { chatId: activeChatId, userId: usr.id },
    });

    if (!chatMember) {
      throw new GraphQLError("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: usr.id },
      include: {
        chatMembers: {
          where: {
            chatId: activeChatId,
          },
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
                  skip: 1,
                  cursor: {
                    id: myCursor,
                  },
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

    const chats = user?.chatMembers?.map((cm) => cm.chat) ?? [];

    // if not user return a hasMore set to false
    console.log("padination data: ", chats);
    return {
      chats,
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
