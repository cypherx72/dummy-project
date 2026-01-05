import crypto from "crypto";

export const generateOTP = (length: number) => {
  return crypto
    .randomInt(Math.pow(10, length - 1), Math.pow(10, length))
    .toString();
};

export const sendResetPasswordEmail = (email: string, resetToken: string) => {
  return {
    status: 200,
    code: "EMAIL_SENT",
    message: "...",
  };
};
