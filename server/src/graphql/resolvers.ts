import { SendOTP } from "./auth/send-otp.js";
import { VerifyOTP } from "./auth/verify-otp.js";
import { SignInViaPassword, SignInViaProvider } from "./auth/sign-in.js";
import { FetchSessionData } from "./auth/fetch-session-data.js";
import { LogInViaPassword, LogInViaProvider } from "./auth/log-in.js";
import { ResetPassword } from "./auth/reset-password.js";
import { ForgotPassword } from "./auth/forgot-password.js";
import { Middleware } from "./auth/middleware.js";
import { FetchChatMetadata } from "./chat/fetch-chat-metadata.js";
import { SendMessage } from "./chat/send-message.js";
import { SendReaction } from "./chat/reactions.js";
import { MarkChatAsRead } from "./chat/mark-chat-as-read.js";
import { dateScalar } from "./custom-types.js";
import { EditMessage } from "./chat/edit-message.js";

export const resolvers = {
  Date: dateScalar,
  Query: {
    FetchSessionData,
    LogInViaPassword,
    LogInViaProvider,
    Middleware,
    ForgotPassword,
    FetchChatMetadata,
  },
  Mutation: {
    SendOTP,
    EditMessage,
    VerifyOTP,
    SignInViaPassword,
    SignInViaProvider,
    ResetPassword,
    SendMessage,
    SendReaction,
    MarkChatAsRead,
  },
};
