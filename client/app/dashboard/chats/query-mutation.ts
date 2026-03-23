import { gql } from "@apollo/client";

/**
 * Mutations
 */

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessageData: SendMessage(input: $input) {
      status
      message
      code
    }
  }
`;

export const PIN_MESSAGE = gql`
  mutation PinMessage($input: PinMessageInput!) {
    pinMessageData: PinMessage(input: $input) {
      status
      message
      code
    }
  }
`;

export const STAR_MESSAGE = gql`
  mutation StarMessage($input: StarMessageInput!) {
    starMessageData: StarMessage(input: $input) {
      status
      message
      code
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($input: DeleteMessageInput!) {
    DeleteMessageData: DeleteMessage(input: $input) {
      status
      message
      code
    }
  }
`;

export const EDIT_MESSAGE = gql`
  mutation EditMessage($input: EditMessageInput!) {
    EditMessageData: EditMessage(input: $input) {
      status
      message
      code
    }
  }
`;

export const SEND_REACTION = gql`
  mutation SendReaction($input: SendReactionInput!) {
    sendReactionData: SendReaction(input: $input) {
      status
      message
      code
    }
  }
`;

export const MARK_CHAT_AS_READ = gql`
  mutation MarkChatAsRead($input: MarkChatAsReadInput!) {
    markChatAsRead: MarkChatAsRead(input: $input) {
      chatId
      unreadMessageCount
      id
    }
  }
`;

/**
 * Queries
 */

export const FETCH_CHAT_MESSAGES = gql`
  query chatMessages($input: chatMessagesInput!) {
    chatMessages(input: $input) {
      chatId
      unreadMessageCount
      nextCursor

      messages {
        id
        chatId
        content
        createdAt
        edited
        replyToId

        sender {
          id
          user {
            id
            name
            email
            image
            role
          }
        }

        reactions {
          id
          emoji
          messageId
          chatMemberId
          createdAt
        }

        messageReceipts {
          id
          messageId
          chatMemberId
          deliveredAt
          readAt
        }

        starredMessages {
          id
          senderId
          messageId
          createdAt
        }

        pinnedMessages {
          id
          messageId
          pinnedById
          pinnedAt
        }

        media {
          id
          cloudinary_url
          size
          name
          file_extension
          resource_type
          public_id
          status
          associate
          createdAt
        }
      }
    }
  }
`;

export const FETCH_CHAT_SUMMARY = gql`
  query chatSummary {
    chatSummary {
      chats {
        id
        imageUrl
        courseName
        unreadMessageCount
        lastMessage {
          content
          createdAt
          senderId
        }
      }
    }
  }
`;
export const CURSOR_PAGINATION = gql`
  query CursorPagination($input: CursorPaginationInput!) {
    cursorPaginationResponse: CursorPagination(input: $input) {
      chatId
      unreadMessageCount
      nextCursor

      messages {
        id
        chatId
        content
        createdAt
        edited
        replyToId

        sender {
          id
          user {
            id
            name
            email
            image
            role
          }
        }

        reactions {
          id
          emoji
          messageId
          chatMemberId
          createdAt
        }

        messageReceipts {
          id
          messageId
          chatMemberId
          deliveredAt
          readAt
        }

        starredMessages {
          id
          senderId
          messageId
          createdAt
        }

        pinnedMessages {
          id
          messageId
          pinnedById
          pinnedAt
        }

        media {
          id
          cloudinary_url
          size
          name
          file_extension
          resource_type
          public_id
          status
          associate
          createdAt
        }
      }
    }
  }
`;
