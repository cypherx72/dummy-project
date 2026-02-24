import { gql } from "@apollo/client";
export const FETCH_CHAT_DATA = gql`
  query FetchChatMetadata($userId: String!) {
    chatContext: FetchChatMetadata(input: { userId: $userId }) {
      chats {
        id
        type
        courseId
        createdAt
        updatedAt

        course {
          name
        }

        messages {
          id
          chatId
          content
          createdAt
          replyToId
          deliveredAt
          readAt

          reactions {
            id
            messageId
            chatMemberId
            createdAt
            emoji
          }

          sender {
            id
            name
            email
            image
          }

          media {
            createdAt
            cloudinary_url
            resource_type
            size
            name
            associate
          }
        }

        chatMembers {
          id
          chatId
          userId
          unreadMessageCount
          role
          isMuted
          joinedAt

          user {
            id
            email
            name
            image
          }
        }
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessageData: SendMessage(input: $input) {
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

export const CURSOR_PAGINATION = gql`
  query CursorPagination($input: CursorPaginationInput!) {
    cursorPaginationResponse: CursorPagination(input: $input) {
      activeChatId
      messages {
        id
        chatId
        content
        createdAt
        replyToId
        deliveredAt
        readAt

        reactions {
          id
          messageId
          chatMemberId
          createdAt
          emoji
        }

        sender {
          id
          name
          email
          image
        }

        media {
          createdAt
          cloudinary_url
          resource_type
          size
          name
          associate
        }
      }
    }
  }
`;
