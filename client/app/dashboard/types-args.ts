import {
  LazyQueryExecFunction,
  useLazyQuery,
  useQuery,
} from "@apollo/client/react";
import React, { RefObject } from "react";

/**
 * Types | Interface
 */

export type ChatMessages = {
  chatMessages: {
    chatId: string;
    unreadMessageCount: number;
    messages: Message[];
    nextCursor: string | null;
  };
};

export type ChatSummary = {
  chatSummary: {
    chats: {
      id: string;
      imageUrl?: string | null;
      courseName: string;
      unreadMessageCount: number;
      lastMessage?: {
        content?: string | null;
        createdAt: string;
        senderId: string;
      } | null;
    }[];
  };
};

export type Media = {
  id: string;
  cloudinary_url: string;
  size: string;
  name: string;
  file_extension: string;
  resource_type: string;
  public_id: string;
  status: "pending" | "completed" | "cancelled";
  associate: "task" | "chat" | "threaded";
  createdAt: string;
};

export type Sender = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "student" | "teacher";
  };
};

export type Reaction = {
  id: string;
  messageId: string;
  chatMemberId: string;
  createdAt: string;
  emoji: string;
};

type MessageReceipt = {
  id: string;
  messageId: string;
  chatMemberId: string;
  deliveredAt: string;
  readAt: string;
};

type StarredMessage = {
  id: string;
  senderId: string;
  messageId: string;
  createdAt: string;
};

export type PinnedMessage = {
  chatId: string;
  id: string;
  message: Message;
};

export type Message = {
  id: string;
  edited: string;
  content: string | null;
  createdAt: string;
  replyToId: string | null;
  sender: Sender;
  reactions: Reaction[];
  messageReceipts: MessageReceipt[];
  starredMessages: StarredMessage[];
  pinnedMessages: PinnedMessage[];
  media: Media | null;
};

export type User = {
  id: string;
  imageUrl: string;
  role: string;
  name: string;
  email: string;
};

export type ChatMember = {
  unreadMessageCount: number;
  userId: string;
  id: string;
  role: "student" | "staffMember";
  isMuted: boolean;
  joinedAt: string;
  user: {
    email: string;
    name: string;
    image: string;
  };
};

export type ChatMetadata = {
  members: ChatMember[];
  media: Media[] | null;

  mediaCount: number;
  filesCount: number;
  linksCount: number;
};

export type markChatAsReadDataType = {
  id: string;
  chatId: string;
  unreadMessageCount: number;
};

export type typingUserType = {
  chatId: string;
  username: string;
  avatarUrl: string;
};

export type MessageNotificationType = {
  messageId: string;
  unreadMessageCount: number;
  chatMemberId: string;
};

export type CursorPaginationType = {
  chatId: string;
  myCursor: string;
};

export type DeleteMessageArgs = {
  chatId: string;
  messageId: string;
};

export type StarMessageArgs = {
  chatId: string;
  messageId: string;
};

export type PinMessageArgs = {
  chatId: string;
  messageId: string;
};

export type CursorPaginationData = {
  cursorPaginationResponse: {
    chatId: string;
    nextCursor: string;
    unreadMessageCount: number;
    messages: Message[];
  };
};

export type CursorPaginationVariables = {
  input: {
    chatId: string;
    myCursor: string;
  };
};

export type ChatUIContextType = {
  messagesByChatId: Record<string, Message[]>;
  chatMessagesLoading: boolean;
  chatMessagesCalled: boolean;
  cursorPaginationQuery: useLazyQuery.ExecFunction<
    CursorPaginationData,
    CursorPaginationVariables
  >;
  cursorPaginationData: unknown;
  chatSummaryLoading: boolean;
  loadChatMessages: () => void;

  messageNotificationByChatId: Record<string, MessageNotificationType[]>;
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isTypingRef: RefObject<boolean>;
  contextMenuMessage: Message | null;

  openEditMessage: boolean;
  openDeleteDialog: boolean;
  setChatSummary: React.Dispatch<
    React.SetStateAction<ChatSummary["chatSummary"]["chats"]>
  >;
  chatSummary: ChatSummary["chatSummary"]["chats"];
  chatMessages: Record<
    ChatMessages["chatMessages"]["chatId"],
    ChatMessages["chatMessages"]["messages"]
  >;

  setChatMessages: React.Dispatch<
    React.SetStateAction<
      Record<
        ChatMessages["chatMessages"]["chatId"],
        ChatMessages["chatMessages"]["messages"]
      >
    >
  >;
  unreadMessageCount: Record<
    ChatMessages["chatMessages"]["chatId"],
    ChatMessages["chatMessages"]["unreadMessageCount"]
  >;
  setUnreadMessageCount: React.Dispatch<
    React.SetStateAction<
      Record<
        ChatMessages["chatMessages"]["chatId"],
        ChatMessages["chatMessages"]["unreadMessageCount"]
      >
    >
  >;
  setTypingUser: React.Dispatch<
    React.SetStateAction<Record<string, typingUserType[]>>
  >;
  openReactionByMsgId: string | null;
  setOpenReactionByMsgId: React.Dispatch<React.SetStateAction<string | null>>;
  setOpenDeleteDialog: (prev: boolean) => void;
  setOpenReplyMessage: (prev: boolean) => void;
  openReplyMessage: boolean;
  setMyCursorByChatId: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  myCursorByChatId: Record<string, string>;
  setMessageNotificationByChatId: React.Dispatch<
    React.SetStateAction<Record<string, MessageNotificationType[]>>
  >;
  setOpenEditMessage: (prev: boolean) => void;
  setContextMenuMessage: (prev: Message | null) => void;
  typingUser: Record<string, typingUserType[]>;
};

/**
 * Arguments
 */

export type SendMessageArgs = {
  chatId: string;
  content: string;
  media?: string;
  replyToId?: string;
};

export type EditMessageArgs = {
  chatId: string;
  content: string;
  messageId: string;
};

export type SendReactionArgs = {
  chatId: string;
  emoji: string;
  messageId: string;
};

export type MarkChatAsReadArgs = {
  chatId: string;
};
