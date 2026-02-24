import { SignInViaPassword, SignInViaProvider } from "./auth/sign-in.js";
import { FetchSessionData } from "./auth/fetch-session-data.js";
import { LogInViaPassword, LogInViaProvider } from "./auth/log-in.js";
import { ResetPassword } from "./auth/reset-password.js";
import { ForgotPassword } from "./auth/forgot-password.js";
import { FetchChatMetadata } from "./chat/fetch-chat-metadata.js";
import { SendMessage } from "./chat/send-message.js";
import { SendReaction } from "./chat/reactions.js";
import { MarkChatAsRead } from "./chat/mark-chat-as-read.js";
import { dateScalar } from "./custom-types.js";
import { EditMessage } from "./chat/edit-message.js";
import { CursorPagination } from "./chat/pagination.js";
import { SendVerificationToken } from "./auth/send-verification-token.js";
import { VerifyAuthToken } from "./auth/verify-auth-token.js";
import { ClearAuthToken } from "./auth/clear-auth-token.js";

export const resolvers = {
  Date: dateScalar,
  Query: {
    FetchSessionData,
    LogInViaPassword,
    LogInViaProvider,
    VerifyAuthToken,
    ForgotPassword,
    CursorPagination,
    FetchChatMetadata,
  },
  Mutation: {
    EditMessage,
    SendVerificationToken,
    ClearAuthToken,
    SignInViaPassword,
    SignInViaProvider,
    ResetPassword,
    SendMessage,
    SendReaction,
    MarkChatAsRead,
  },
};
