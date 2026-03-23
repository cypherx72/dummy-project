import React, { useEffect, useMemo, useRef } from "react";
import { useChatSocket } from "@/app/hooks/chat/useSockets";
import type {
  Message,
  typingUserType,
  User,
  Reaction,
  PinnedMessage,
} from "@/app/dashboard/types-args";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export type SocketHandler = {
  activeChatId: string;
  user: User;
  setChatMessages: React.Dispatch<
    React.SetStateAction<Record<string, Message[]>>
  >;
  setTypingUser: React.Dispatch<
    React.SetStateAction<Record<string, typingUserType[]>>
  >;
  setMessageNotificationByChatId: any;
};

export function useSocketHandlers({
  activeChatId,
  setChatMessages,
  setMessageNotificationByChatId,
  setTypingUser,
  user,
}: SocketHandler) {
  const isTypingRef = useRef(false);
  const { socket } = useChatSocket();

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
      }, 5000),
    [socket],
  );

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: Message & { chatId: string }) => {
      console.log("new Message", msg);

      // Update messages
      setChatMessages((prev) => {
        const existingMessages = prev[msg.chatId] ?? [];

        return {
          ...prev,
          [msg.chatId]: [...existingMessages, msg],
        };
      });

      // Update notifications
      setMessageNotificationByChatId((prev) => {
        const existingNotifications = prev[msg.chatId] ?? [];

        const myNotification = existingNotifications.find(
          (n) => n.chatMemberId === "1",
        );

        if (!myNotification) {
          return {
            ...prev,
            [msg.chatId]: [
              {
                messageId: msg.id,
                unreadMessageCount: activeChatId === msg.chatId ? 0 : 1,
                chatMemberId: "1",
              },
            ],
          };
        }

        return {
          ...prev,
          [msg.chatId]: existingNotifications.map((n) =>
            n.chatMemberId === "1"
              ? {
                  ...n,
                  messageId: msg.id,
                  unreadMessageCount:
                    activeChatId === msg.chatId ? 0 : n.unreadMessageCount + 1,
                }
              : n,
          ),
        };
      });
    };

    const handleTyping = (data: typingUserType & { chatId: string }) => {
      setTypingUser((prev) => {
        const existing = prev[data.chatId] ?? [];

        return {
          ...prev,
          [data.chatId]: [...existing, data],
        };
      });
    };

    const handleStopTyping = (data: typingUserType) => {
      setTypingUser((prev) => {
        const existing =
          prev[data.chatId].filter((user) => user.chatId !== data.chatId) ?? [];

        return {
          ...prev,
          [data.chatId]: [...existing],
        };
      });
    };

    const handleNewReaction = (reaction: Reaction & { chatId: string }) => {
      setChatMessages((prev) => {
        const existing = prev[reaction.chatId] ?? [];

        const updated = existing.map((msg) => {
          if (msg.id !== reaction.messageId) return msg;

          return {
            ...msg,
            reactions: [...msg.reactions, reaction],
          };
        });

        return {
          ...prev,
          [reaction.chatId]: updated,
        };
      });
    };

    const handleDeleteMessage = (
      msg: Message & { chatId: string } & { deleted: boolean },
    ) => {
      console.log("deleted message", msg);

      setChatMessages((prev) => {
        const existingMessages = prev[msg.chatId] ?? [];

        return {
          ...prev,
          [msg.chatId]: existingMessages.map((message) => {
            if (message.id === msg.id) {
              return {
                ...message,
                // add deleted to true here
                // chtng the Message type to accomodate all teh fields
              };
            }
            return message;
          }),
        };
      });
    };

    const handleEditMessage = (msg: Message & { chatId: string }) => {
      setChatMessages((prev) => {
        const existingMessages = prev[msg.chatId] ?? [];

        return {
          ...prev,
          [msg.chatId]: existingMessages.map((message) => {
            if (message.id === msg.id) {
              return {
                ...message,
                content: msg.content,
                edited: msg.edited,
              };
            }
            return message;
          }),
        };
      });
    };

    const handlePinMessage = (msg: PinnedMessage) => {
      setChatMessages((prev) => {
        const existingMessages = prev[msg.chatId] ?? [];

        return {
          ...prev,
          [msg.chatId]: existingMessages.map((message) => {
            if (message.id === msg.message.id) {
              return {
                ...message,
                pinnedMessages: msg.message.pinnedMessages,
              };
            }
            return message;
          }),
        };
      });
    };

    const handleStarMessage = (msg: Message & { chatId: string }) => {
      console.log("start msg", msg);
      setChatMessages((prev) => {
        const existingMessages = prev[msg.chatId] ?? [];

        return {
          ...prev,
          [msg.chatId]: existingMessages.map((message) => {
            if (message.id === msg.id) {
              return {
                ...message,
                starredMessages: msg.starredMessages,
              };
            }
            return message;
          }),
        };
      });
    };

    socket?.on("typing", handleTyping);
    socket?.on("stopTyping", handleStopTyping);
    socket.on("reaction:new", handleNewReaction);
    socket.on("message:edit", handleEditMessage);
    socket.on("message:new", handleNewMessage);
    socket.on("message:pin", handlePinMessage);
    socket.on("message:star", handleStarMessage);
    socket.on("message:delete", handleDeleteMessage);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("message:delete", handleDeleteMessage);
      socket.off("message:edit", handleEditMessage);
      socket.off("message:new", handleNewMessage);
      socket.off("reaction:new", handleNewReaction);
    };
  }, [socket, debouncedStopTyping, setChatMessages, setTypingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!socket || !activeChatId) return;

    const username = user.name;
    const avatarUrl = user.imageUrl;

    const value = e.target.value;
    if (!value.trim()) {
      if (isTypingRef.current) {
        socket.emit("stopTyping", {
          chatId: activeChatId,
          username,
          avatarUrl,
        });
        isTypingRef.current = false;
      }
      return;
    }

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

  return {
    handleInputChange,
  };
}
