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
