import { useMutation } from "@apollo/client/react";

import {
  SEND_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  SEND_REACTION,
  PIN_MESSAGE,
  STAR_MESSAGE,
  MARK_CHAT_AS_READ,
} from "@/app/dashboard/chats/query-mutation";
import {
  SendMessageArgs,
  EditMessageArgs,
  SendReactionArgs,
  MarkChatAsReadArgs,
  DeleteMessageArgs,
  StarMessageArgs,
  PinMessageArgs,
} from "@/app/dashboard/types-args";

export function useChatMutations() {
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const [editMessageMutation] = useMutation(EDIT_MESSAGE);
  const [sendReactionMutation] = useMutation(SEND_REACTION);
  const [pinMessageMutation] = useMutation(PIN_MESSAGE);
  const [starMessageMutation] = useMutation(STAR_MESSAGE);
  const [deleteMessageMutation] = useMutation(DELETE_MESSAGE);
  const [markChatAsReadMutation] = useMutation(MARK_CHAT_AS_READ);

  function markChatAsRead(args: MarkChatAsReadArgs) {
    return markChatAsReadMutation({ variables: { input: args } });
  }

  function starMessage(args: StarMessageArgs) {
    return starMessageMutation({ variables: { input: args } });
  }

  function pinMessage(args: PinMessageArgs) {
    return pinMessageMutation({ variables: { input: args } });
  }

  function sendMessage(args: SendMessageArgs) {
    return sendMessageMutation({ variables: { input: args } });
  }

  function editMessage(args: EditMessageArgs) {
    return editMessageMutation({ variables: { input: args } });
  }

  function sendReaction(args: SendReactionArgs) {
    return sendReactionMutation({ variables: { input: args } });
  }

  function deleteMessage(args: DeleteMessageArgs) {
    return deleteMessageMutation({ variables: { input: args } });
  }
  return {
    sendMessage,
    deleteMessage,
    starMessage,
    pinMessage,
    editMessage,
    sendReaction,
    markChatAsRead,
  };
}
