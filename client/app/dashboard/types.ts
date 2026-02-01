import { RefObject } from "react";

export type ChatSummary = {
  chatId: string;
  chatName: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
  unreadMessageCount: number;
};

export type SendReactionArgs = {
  chatId: string;
  emoji: string;
  messageId: string;
};

export type Media = {
  createdAt: string;
  cloudinary_url: string;
  resourceType: "image" | "video" | "file";
  size: number;
  name: string;
};

export type Message = {
  id: string;
  chatId: string;
  content: string;
  createdAt: string;

  replyToId: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  reactions: Reaction[];

  sender: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  media: Media | null;
};

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

export type Reaction = {
  chatId: string;
  id: string;
  messageId: string;
  chatMemberId: string;
  createdAt: string;
  emoji: string;
};

export type ChatMember = {
  userId: string;
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

export type ChatBootstrapPayloadType = {
  chatContext: {
    chats: {
      id: string;
      type: "course" | "group" | "private";
      courseId: string | null;
      createdAt: string;
      updatedAt: string;
      messages: Message[];
      chatMembers: ChatMember[];
    }[];
  };
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
  unreadCount: number;
};

export type CursorPaginationType = {
  activeChatId: string;
  myCursor: string;
};

export type ChatUIContextType = {
  chatSummaries: ChatSummary[];
  messagesByChatId: Record<string, Message[]>;
  messageNotification: Record<string, MessageNotificationType>;
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
  fetchOlderMessages: ({
    activeChatId,
    myCursor,
  }: CursorPaginationType) => void;
  openEditMessage: boolean;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (prev: boolean) => void;
  setMyCursorByChatId: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  myCursorByChatId: Record<string, string>;
  setMessageNotification: React.Dispatch<
    React.SetStateAction<Record<string, MessageNotificationType>>
  >;
  setOpenEditMessage: (prev: boolean) => void;
  setContextMenuMessageId: (prev: Message | null) => void;
  setOpenRightChatAside: (prev: boolean) => void;
  typingUser: Record<string, typingUserType[]>;
  sendReaction: ({ chatId, messageId, emoji }: SendReactionArgs) => void;
};
