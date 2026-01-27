// Context for managing chat-related state and actions in the dashboard
"use client";
import {
  MARK_CHAT_AS_READ,
  SEND_MESSAGE,
  SEND_REACTION,
  EDIT_MESSAGE,
  FETCH_CHAT_DATA,
} from "./query-mutation";
import { EditMessageArgs, SendMessageArgs, SendReactionArgs } from "../types";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  RefObject,
} from "react";
import { connectSocket } from "@/lib/socketIO";
import { Socket } from "socket.io-client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  ChatSummary,
  Message,
  ChatMetadata,
  ChatBootstrapPayloadType,
  Reaction,
  typingUserType,
} from "../types";

const ChatUIContext = createContext<ChatUIContextType | undefined>(undefined);
const userId = "1";

type ChatUIContextType = {
  chatSummaries: ChatSummary[];
  messagesByChatId: Record<string, Message[]>;
  chatMetadataByChatId: Record<string, ChatMetadata>;
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
  chatBootstrapPayloadLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage: ({ chatId, content, media, replyToId }: SendMessageArgs) => void;
  editMessage: ({ chatId, content, messageId }: EditMessageArgs) => void;

  isTypingRef: RefObject<boolean>;

  openRightChatAside: boolean;
  contextMenuMessageId: Message | null;
  openEditMessage: boolean;
  setOpenEditMessage: (prev: boolean) => void;
  setContextMenuMessageId: (prev: Message | null) => void;
  setOpenRightChatAside: (prev: boolean) => void;
  typingUser: Record<string, typingUserType[]>;
  sendReaction: ({ chatId, messageId, emoji }: SendReactionArgs) => void;
};

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [typingUser, setTypingUser] = useState<
    Record<string, typingUserType[]>
  >({});
  const [message, setMessage] = useState("");
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, Message[]>
  >({});
  const [contextMenuMessageId, setContextMenuMessageId] =
    useState<Message | null>(null);
  const [openRightChatAside, setOpenRightChatAside] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
  const [chatMetadataByChatId, setChatMetadataByChatId] = useState<
    Record<string, ChatMetadata>
  >({});
  const isTypingRef = useRef(false);
  const [openEditMessage, setOpenEditMessage] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sendMessageMutation, {}] = useMutation(SEND_MESSAGE);

  const [editMessageMutation, {}] = useMutation(EDIT_MESSAGE);

  const [markChatAsReadMutation, {}] = useMutation(MARK_CHAT_AS_READ);

  const [sendReactionMutation, {}] = useMutation(SEND_REACTION);

  const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedStopTyping = useMemo(
    () =>
      debounce((chatId: string, username: string, avatarUrl: string) => {
        if (!socket) return;

        socket.emit("stopTyping", {
          chatId,
          username,
          avatarUrl,
        });

        isTypingRef.current = false;
      }, 10000),
    [socket],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!socket || !activeChatId) return;

    const value = e.target.value;
    if (!value.trim()) return;

    const username = "tavonga";
    const avatarUrl = "";

    if (!isTypingRef.current) {
      socket.emit("typing", {
        chatId: activeChatId,
        username,
        avatarUrl,
      });

      isTypingRef.current = true;
    }

    debouncedStopTyping(activeChatId, username, avatarUrl);
  };

  useEffect(() => {
    return () => {
      if (isTypingRef.current && socket && activeChatId) {
        socket.emit("stopTyping", {
          chatId: activeChatId,
          username: "tavonga",
          avatarUrl: "",
        });
      }
    };
  }, [activeChatId, socket]);

  useEffect(() => {
    setContextMenuMessageId(null);
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;

    markChatAsReadMutation({
      variables: {
        input: { chatId: activeChatId },
      },
      onCompleted: (res) => {
        console.log(res);
        const updated = res.markChatAsRead;

        setChatSummaries((prev) =>
          prev.map((chat) =>
            chat.chatId === updated.chatId
              ? {
                  ...chat,
                  chatMemberId: updated.id,
                  unreadMessageCount: updated.unreadMessageCount,
                }
              : chat,
          ),
        );
      },
    });
  }, [activeChatId, markChatAsReadMutation]);

  useEffect(() => {
    if (!socket) return;

    socket?.on("typing", (data: typingUserType & { chatId: string }) => {
      setTypingUser((prev) => {
        const existing = prev[data.chatId] ?? [];

        return {
          ...prev,
          [data.chatId]: [...existing, data],
        };
      });
    });

    socket?.on("stopTyping", (data) => {
      console.log("removing tpingusers");
      setTypingUser((prev) => {
        const existing =
          prev[data.chatId].filter((user) => user.chatId !== data.chatId) ?? [];

        return {
          ...prev,
          [data.chatId]: [...existing],
        };
      });
    });

    socket.on("reaction:new", handleNewReaction);

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("typing");
      socket.off("stopped-typing");
      socket.off("message:new", handleNewMessage);
      socket.off("reaction:new", handleNewReaction);
    };
  }, [socket]);

  const handleNewMessage = (msg: Message) => {
    // Update messages

    setMessagesByChatId((prev) => ({
      ...prev,
      [msg.chatId]: [...(prev[msg.chatId] || []), msg],
    }));

    // Update sidebar summary
    setChatSummaries((prev) =>
      prev.map((chat) =>
        chat.chatId === msg.chatId
          ? {
              ...chat,
              lastMessage: msg.content,
              lastMessageCreatedAt: msg.createdAt,
              unreadMessageCount: chat.unreadMessageCount + 1,
            }
          : chat,
      ),
    );
  };

  const handleNewReaction = (reaction: Reaction) => {
    setMessagesByChatId((prev) => {
      return {
        [reaction.chatId]: [...prev[reaction.chatId]].map((msg) => {
          if (msg.id === reaction.messageId) {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), reaction],
            };
          }
          return msg;
        }),
      };
    });
  };

  // const handleNewMediaMessage = (msg: Message) => {
  //   handleNewMessage(msg);

  //   setChatMetadataByChatId((prev) => {
  //     const meta = prev[msg.chatId];
  //     if (!meta) return prev;

  //     return {
  //       ...prev,
  //       [msg.chatId]: {
  //         ...meta,
  //         mediaCount: meta.mediaCount + 1,
  //       },
  //     };
  //   });
  // };

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    setSocket(socket);

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // see logs from server
  useEffect(() => {
    console.log("messagesByChatId updated: ", messagesByChatId);
    console.log("chatSummaries updated: ", chatSummaries);
    console.log("chatMetadataByChatId updated: ", chatMetadataByChatId);
  }, [messagesByChatId, chatSummaries, chatMetadataByChatId]);

  const { loading: chatBootstrapPayloadLoading, data: chatBootstrapPayload } =
    useQuery<ChatBootstrapPayloadType>(FETCH_CHAT_DATA, {
      skip: !userId,
      variables: { userId },
    });

  useEffect(() => {
    if (chatBootstrapPayload) {
      // upon receiving chatBootstrapPayload, set chat summaries, metadata and messages
      const chats = chatBootstrapPayload.chatContext.chats;
      console.log(chats);

      // setting chat summaries
      setChatSummaries(
        chats.map((chat) => ({
          chatId: chat.id,
          course: chat.course.name,
          type: chat.type,
          lastMessage:
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].content || ""
              : "",
          lastMessageCreatedAt:
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].createdAt
              : chat.createdAt,
          unreadMessageCount: 0, // initial unread count set to 0
          chatName: "", // will be set later
          avatarUrl: "", // will be set later
        })),
      );

      // setting messages by chat id
      setMessagesByChatId(
        chats.reduce(
          (acc, chat) => {
            acc[chat.id] = chat.messages;
            return acc;
          },
          {} as Record<string, Message[]>,
        ),
      );

      // setting chat metadata by chat id
      setChatMetadataByChatId(
        chats.reduce(
          (acc, chat) => {
            const mediaItems = chat.messages
              .map((msg) => msg.media)
              .filter(
                (media): media is NonNullable<typeof media> => media !== null,
              );
            acc[chat.id] = {
              members: chat.chatMembers,
              media: mediaItems,
              mediaCount: mediaItems.length,
              filesCount: mediaItems.filter((m) => m.resourceType === "file")
                .length,
              linksCount: 0, // to be implemented
            };
            return acc;
          },
          {} as Record<string, ChatMetadata>,
        ),
      );
    }
  }, [chatBootstrapPayload]);

  function sendReaction({ chatId, emoji, messageId }: SendReactionArgs) {
    if (!chatId || !emoji || !messageId) return;
    console.log("from layout reactionsend: ", chatId, emoji, messageId);
    sendReactionMutation({
      variables: {
        input: {
          chatId,
          emoji,
          messageId,
        },
      },
    });
  }

  function editMessage({ chatId, content, messageId }: EditMessageArgs) {
    if ((!content && !chatId) || !socket || !chatId) return;

    editMessageMutation({
      variables: {
        input: {
          chatId,
          content,
          messageId,
        },
      },
    });

    setOpenEditMessage(false);
    setContextMenuMessageId(null);
  }

  function sendMessage({ chatId, content, media, replyToId }: SendMessageArgs) {
    if ((!content && !media) || !socket || !chatId) return;

    sendMessageMutation({
      variables: {
        input: {
          chatId,
          content,
          media,
          replyToId,
        },
      },
    });

    setContextMenuMessageId(null);
  }

  // Attaching session to context value for access in child components
  return (
    <ChatUIContext
      value={{
        chatSummaries,
        messagesByChatId,
        setOpenRightChatAside,
        openRightChatAside,
        message,
        chatMetadataByChatId,
        activeChatId,
        setActiveChatId,
        handleInputChange,
        editMessage,
        chatBootstrapPayloadLoading,
        setMessage,
        sendReaction,
        setContextMenuMessageId,
        contextMenuMessageId,
        sendMessage,
        openEditMessage,
        setOpenEditMessage,
        isTypingRef,
        typingUser,
      }}
    >
      {children}
    </ChatUIContext>
  );
}

export const useChatUI = () => {
  const ctx = useContext(ChatUIContext);
  if (!ctx) {
    throw new Error("useChatUI must be used within ChatProvider");
  }
  return ctx;
};
