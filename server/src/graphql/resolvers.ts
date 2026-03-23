import { chatSummary } from "./chat/chat-summary.js";
import { chatMessages } from "./chat/chat-messages.js";
import { SendMessage } from "./chat/send-message.js";
import { SendReaction } from "./chat/reactions.js";
import { MarkChatAsRead } from "./chat/mark-chat-as-read.js";
import { dateScalar } from "./custom-types.js";
import { EditMessage } from "./chat/edit-message.js";
import { CursorPagination } from "./chat/pagination.js";
import { DeleteMessage } from "./chat/delete-message.js";
import { PinMessage } from "./chat/pin-message.js";
import { StarMessage } from "./chat/star-message.js";
import { CreateTask } from "./tasks/createTask.js";
import { GetDashboardData } from "./tasks/getDashboardData.js";
import { GetUploadSignature } from "./tasks/getUploadSignature.js";

export const resolvers = {
  Date: dateScalar,
  Query: {
    CursorPagination,
    chatMessages,
    GetDashboardData,
    chatSummary,
  },
  Mutation: {
    EditMessage,
    PinMessage,
    StarMessage,
    SendMessage,
    DeleteMessage,
    SendReaction,
    MarkChatAsRead,

    GetUploadSignature,
    CreateTask,
  },
};
