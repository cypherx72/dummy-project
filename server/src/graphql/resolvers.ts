import { SendOTP } from "./auth/send-otp.js";
import { VerifyOTP } from "./auth/verify-otp.js";
import { SignInViaPassword, SignInViaProvider } from "./auth/sign-in.js";
import { FetchSessionData } from "./auth/fetch-session-data.js";
import { LogInViaPassword, LogInViaProvider } from "./auth/log-in.js";
import { ResetPassword } from "./auth/reset-password.js";
import { ForgotPassword } from "./auth/forgot-password.js";
import { Middleware } from "./auth/middleware.js";
import { FetchChatMetadata } from "./chat/fetch-chat-metadata.js";
export const resolvers = {
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
    VerifyOTP,
    SignInViaPassword,
    SignInViaProvider,
    ResetPassword,
  },
};
