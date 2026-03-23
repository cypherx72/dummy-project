"use client";

import {
  Message,
  typingUserType,
  ChatSummary,
  ChatMessages,
  MessageNotificationType,
} from "@/app/dashboard/types-args";
import { useState, useEffect, useRef } from "react";
import { useChatQueries } from "@/app/hooks/chat/useChatQueries";
import { useSocketHandlers } from "@/app/hooks/chat/useSocketHandlers";
import { ChatUIContext } from "./chat-context";
import { useSession } from "../session-context";

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // state
  const [typingUser, setTypingUser] = useState<
    Record<string, typingUserType[]>
  >({});

  const { user } = useSession();
  const [contextMenuMessage, setContextMenuMessage] = useState<Message | null>(
    null,
  );

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<
    Record<
      ChatMessages["chatMessages"]["chatId"],
      ChatMessages["chatMessages"]["messages"]
    >
  >({});

  const [unreadMessageCount, setUnreadMessageCount] = useState<
    Record<
      ChatMessages["chatMessages"]["chatId"],
      ChatMessages["chatMessages"]["unreadMessageCount"]
    >
  >({});

  const [myCursorByChatId, setMyCursorByChatId] = useState<
    Record<string, string>
  >({});

  const [chatSummary, setChatSummary] = useState<
    ChatSummary["chatSummary"]["chats"]
  >([]);

  const [messageNotificationByChatId, setMessageNotificationByChatId] =
    useState<Record<string, MessageNotificationType[]>>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditMessage, setOpenEditMessage] = useState(false);
  const [openReplyMessage, setOpenReplyMessage] = useState(false);
  const [openReactionByMsgId, setOpenReactionByMsgId] = useState<string | null>(
    null,
  );

  const isTypingRef = useRef(false);

  // cleanup effect
  useEffect(() => {
    if (!contextMenuMessage) {
      setOpenDeleteDialog(false);
      setOpenReplyMessage(false);
      setOpenEditMessage(false);
    }
  }, [contextMenuMessage, activeChatId]);

  useEffect(() => {
    console.log("chatMsesage", chatMessages);
  }, [chatMessages]);

  // load hooks
  const {
    chatSummaryLoading,
    chatMessagesLoading,
    chatMessagesCalled,
    loadChatMessages,
    cursorPaginationQuery,
    cursorPaginationData,
  } = useChatQueries({
    activeChatId,
    setUnreadMessageCount,
    setMyCursorByChatId,
    chatMessages,
    setMessageNotificationByChatId,
    setChatMessages,
    setChatSummary,
  });

  const { handleInputChange } = useSocketHandlers({
    activeChatId,
    setMessageNotificationByChatId,
    setChatMessages,
    setTypingUser,
    user,
  });

  return (
    <ChatUIContext.Provider
      value={{
        chatSummaryLoading,
        chatMessagesLoading,
        openReactionByMsgId,
        setOpenReactionByMsgId,
        chatMessagesCalled,
        loadChatMessages,
        cursorPaginationQuery,
        cursorPaginationData,
        handleInputChange,
        chatMessages,
        chatSummary,
        setChatSummary,
        setChatMessages,
        setUnreadMessageCount,
        typingUser,
        setTypingUser,
        activeChatId,
        setActiveChatId,
        myCursorByChatId,
        setMyCursorByChatId,
        contextMenuMessage,
        unreadMessageCount,
        setContextMenuMessage,
        messageNotificationByChatId,
        openDeleteDialog,
        setOpenDeleteDialog,
        openEditMessage,
        setOpenEditMessage,
        openReplyMessage,
        setOpenReplyMessage,
        isTypingRef,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
}
