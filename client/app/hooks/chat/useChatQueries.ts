import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import {
  FETCH_CHAT_SUMMARY,
  FETCH_CHAT_MESSAGES,
  CURSOR_PAGINATION,
} from "@/app/dashboard/chats/query-mutation";
import {
  ChatSummary,
  ChatMessages,
  CursorPaginationVariables,
  CursorPaginationData,
} from "@/app/dashboard/types-args";

type ChatQueriesProps = {
  activeChatId: string | null;
  setChatMessages: React.Dispatch<any>;
  setUnreadMessageCount: React.Dispatch<React.SetStateAction<any>>;
  setChatSummary: React.Dispatch<
    React.SetStateAction<ChatSummary["chatSummary"]["chats"]>
  >;
  setMyCursorByChatId: React.Dispatch<React.SetStateAction<any>>;
  setMessageNotificationByChatId: React.Dispatch<React.SetStateAction<any>>;
  chatMessages: any;
};

export function useChatQueries({
  activeChatId,
  setChatMessages,
  setMessageNotificationByChatId,
  setUnreadMessageCount,
  setChatSummary,
  setMyCursorByChatId,
  chatMessages,
}: ChatQueriesProps) {
  // Chat summary query
  const { loading: chatSummaryLoading, data: chatSummaryData } =
    useQuery<ChatSummary>(FETCH_CHAT_SUMMARY);

  // Chat messages query
  const [
    loadChatMessages,
    {
      called: chatMessagesCalled,
      loading: chatMessagesLoading,
      data: chatMessagesData,
    },
  ] = useLazyQuery<ChatMessages>(FETCH_CHAT_MESSAGES);

  // Cursor pagination query
  const [cursorPaginationQuery, { data: cursorPaginationData }] = useLazyQuery<
    CursorPaginationData,
    CursorPaginationVariables
  >(CURSOR_PAGINATION);

  useEffect(() => {
    console.log("pag data", cursorPaginationData);
  }, [cursorPaginationData]);

  // Update chat messages
  useEffect(() => {
    if (!chatMessagesData) return;

    const { chatId, messages, unreadMessageCount, nextCursor } =
      chatMessagesData.chatMessages;

    setChatMessages((prev: ChatMessages) => ({
      ...prev,
      [chatId]: messages,
    }));

    setUnreadMessageCount((prev) => ({
      ...prev,
      [chatId]: unreadMessageCount,
    }));

    setMyCursorByChatId((prev) => ({
      ...prev,
      [chatId]: nextCursor,
    }));

    // Initialize notification state for this chat
    setMessageNotificationByChatId((prev: any) => {
      if (prev?.[chatId]) return prev;

      const lastReadIndex = messages.length - 1 - unreadMessageCount;

      return {
        ...prev,
        [chatId]: [
          {
            messageId: lastReadIndex >= 0 ? messages[lastReadIndex]?.id : null,
            unreadMessageCount,
            chatMemberId: "1",
          },
        ],
      };
    });
  }, [
    activeChatId,
    setChatMessages,
    setUnreadMessageCount,
    chatMessagesData,
    cursorPaginationData,
    setMyCursorByChatId,
    setMessageNotificationByChatId,
  ]);

  useEffect(() => {
    if (!cursorPaginationData) return;

    const { chatId, messages, nextCursor, unreadMessageCount } =
      cursorPaginationData.cursorPaginationResponse;

    setChatMessages((prev: ChatMessages) => {
      const existingMessages = prev[chatId] ?? [];

      return {
        ...prev,
        [chatId]: [...messages, ...existingMessages],
      };
    });

    setMyCursorByChatId((prev) => ({
      ...prev,
      [chatId]: nextCursor,
    }));
  }, [cursorPaginationData, setChatMessages, setMyCursorByChatId]);

  // Update chat summary
  useEffect(() => {
    if (!chatSummaryData) return;

    const chats = chatSummaryData.chatSummary.chats;
    setChatSummary(chats);
  }, [chatSummaryData, setChatSummary]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChatId) return;

    if (chatMessages[activeChatId]) return;

    loadChatMessages({
      variables: {
        input: {
          chatId: activeChatId,
        },
      },
    });
  }, [activeChatId, loadChatMessages, chatMessages]);

  return {
    chatSummaryLoading,
    chatMessagesLoading,
    chatMessagesCalled,
    loadChatMessages,
    cursorPaginationQuery,
    cursorPaginationData,
  };
}
