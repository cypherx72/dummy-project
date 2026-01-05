import { type contextType } from "../../lib/types.js";
import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
const AUTH_SECRET = "pqe4Mqgah1FnwXoJAnxUCFMqTE1ybUMn5yJ+1jtyeWo=";

type verifyOTPArgs = {
  contactNumber: string;
  userOTP: string;
  registrationId: string;
};

export const VerifyOTP = async (
  _: any,
  { input }: { input: verifyOTPArgs },
  { prisma, res }: contextType
) => {
  console.log(input);
  const { contactNumber, registrationId, userOTP } = input;

  // validate schema using zod

  try {
    const userData = await prisma.user.findFirst({
      where: {
        registrationId,
        contactNumber,
      },
      include: {
        otp: true,
      },
    });

    if (!userData) {
      throw GraphQLCustomLError({
        message:
          "Something went wrong. If you continue to have issues registering into your account, contact our **Support team**.",
        code: "USER_NOT_FOUND",
        status: 404,
      });
    }

    if (userData.otp.expiresAt < new Date()) {
      // Expired
      await prisma.otp.update({
        where: { userId: userData.id },
        data: { code: null },
      });
      throw GraphQLCustomLError({
        message: "Invalid OTP. Please re-check your OTP or Credentials.",
        code: "INVALID_OTP",
        status: 403,
      });
    }

    if (userData.otp.code !== userOTP) {
      throw GraphQLCustomLError({
        message: "Invalid OTP. Please re-check your OTP or Credentials.",
        code: "INVALID_OTP",
        status: 403,
      });
    }

    await prisma.otp.update({
      where: {
        userId: userData.id,
      },
      data: {
        code: "",
      },
    });

    const authToken = await prisma.session.upsert({
      create: {
        userId: userData.id,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        sessionToken: crypto.randomUUID(),
      },
      where: {
        userId: userData.id,
      },
      update: {
        expires: new Date(Date.now() + 15 * 60 * 1000),
        sessionToken: crypto.randomUUID(),
      },
    });

    console.log(authToken.id);
    //err here
    const token: string = jwt.sign({ sessionId: authToken.id }, AUTH_SECRET!, {
      expiresIn: "30m",
    });
    // Run every 3 minutes
    setInterval(async () => {
      try {
        await prisma.session.deleteMany({
          where: { expires: { lt: new Date() } },
        });
      } catch (err) {
        console.error("Cleanup failed:", err);
      }
    }, 1000 * 60 * 3);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 30 * 60,
      })
    );

    return {
      status: 200,
      message: "OTP successfully verified.",
      code: "OTP_VERIFIED",
    };
  } catch (err) {
    console.error("Error in verifyOTP:", err);

    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message:
        "Something went wrong. If you continue to have issues registering into your account, contact our **Support team**.",
      code: "SERVER_ERROR",
      status: 500,
    });
  }
};

/*

1. verify otp
2. if not match => reject, else if match, redirect, => 
  upsert user token in the db
  save token to db and return the session id(sid)
  provide a token with a sid
  set timer of 15min to cleanup all tokens which are over 15min because they will be stale in the frontend/create a cleanup db func
  clean up the opt delete it only the otp field

3. 
*/
