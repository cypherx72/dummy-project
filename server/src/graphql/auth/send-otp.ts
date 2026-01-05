import twilio from "twilio";
import { type contextType } from "../../lib/types.js";
import { generateOTP } from "../../lib/otp.js";
import { GraphQLError } from "graphql";
import { GraphQLCustomLError } from "../../lib/error.js";
import { nullable } from "zod";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export type SendOtpArgs = {
  contactNumber: string;
  registrationId: string;
};

export const SendOTP = async (
  _: any,
  { input }: { input: SendOtpArgs },
  { prisma }: contextType
) => {
  const { contactNumber, registrationId } = input;
  console.log(contactNumber, registrationId);

  try {
    const user = await prisma.user.findFirst({
      where: {
        registrationId,
        contactNumber,
      },
      include: {
        otp: true,
      },
    });

    if (!user) {
      throw GraphQLCustomLError({
        message:
          "Please re-check your credentials. If you continue to have issues registering into your account, contact our **Support team**.",
        code: "USER_NOT_FOUND",
        status: 404,
      });
    }

    if (user.emailVerified) {
      throw GraphQLCustomLError({
        message:
          "Please re-check your credentials. If you continue to have issues registering into your account, contact our **Support team**.",
        code: "EMAIL_ALREADY_EXISTS",
        status: 403,
      });
    }

    if (user.otp && user.otp.terminateOtp >= 4) {
      // Delete OTP record after 30min
      setTimeout(async () => {
        await prisma.otp.delete({
          where: { userId: user.id },
        });
        return;
      }, 5000000); //simulating for 5 seconds: for dev purpose

      throw GraphQLCustomLError({
        message: "Too many attempts.Please try again later!",
        code: "TERMINATE_OTP",
        status: 403,
      });
    }

    const otpCode = generateOTP(6);
    const message = `Welcome to Circle Space! 🎉  
Your one-time password (OTP) is ${otpCode}.  

It's valid for 10 minutes. Please keep it private to protect your account.`;

    // Create or update OTP record

    const updatedOtp = await prisma.otp.upsert({
      where: { userId: user.id },
      update: {
        code: otpCode,
        terminateOtp: { increment: 1 },
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: user.id,
        code: otpCode,
        terminateOtp: 1,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    if (!updatedOtp) {
      throw GraphQLCustomLError({
        message: "",
        code: "UPDATE_FAILED",
        status: 500,
      });
    }

    setInterval(async () => {
      await prisma.otp.updateMany({
        where: { expiresAt: { lt: new Date() } },
        data: { code: null },
      });
    }, 60 * 1000); // 1 minute

    // send SMS
    // await client.messages.create({
    //   body: message,
    //   to: contactNumber,
    //   from: ,TWILIO_PHONE_NUMBER
    // });

    // Schedule OTP expiry
    setTimeout(async () => {
      const otp = await prisma.otp.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (otp && otp.code !== null) {
        await prisma.otp.update({
          where: { userId: user.id },
          data: { code: null },
        });
      }

      console.log("Cleared otp for user: ", user.id);
    }, 3 * 60 * 1000); // 10 mins

    return {
      status: 200,
      code: "OTP_SENT",
      message: "OTP sent successfully.",
    };
  } catch (err) {
    console.error("An error occurred while sending OTP:", err);

    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message:
        "Something went wrong. If you continue to have issues registering into your account, contact our **Support team**.",
      code: "SERVER_ERROR",
      status: 500,
    });
  }
};
