import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import type { Response, Request } from "express";
import { errorResponse, successResponse } from "../../utils/api-response.js";
import { AUTH_SCHEMA } from "../../utils/schema.js";
import * as cookie from "cookie";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password, token } = req.body;

  console.log(email, password, token);
  // Validate input
  if (!password || !email || !token) {
    return errorResponse(
      res,
      "INVALID_INPUT",
      "Email, password and reset token are required.",
      400,
    );
  }

  // Validate schema
  const { data, success } = AUTH_SCHEMA.safeParse({ email, password });

  if (!success) {
    return errorResponse(res, "VALIDATION_ERROR", "Invalid input.", 400);
  }

  const verifiedEmail = data.email;
  const verifiedPassword = data.password;

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: verifiedEmail },
    });

    if (!user) {
      return errorResponse(res, "USER_NOT_FOUND", "User not found.", 404);
    }

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return errorResponse(res, "EXPIRED_TOKEN", "Reset link expired.", 401);
      }

      return errorResponse(res, "INVALID_TOKEN", "Invalid reset token.", 401);
    }

    const hashedIncomingToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Check token exists in DB + not expired
    const tokenRecord = await prisma.token.findFirst({
      where: {
        id: decodedToken.tokenId,
        token: hashedIncomingToken,
        type: "reset_token",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return errorResponse(
        res,
        "TOKEN_INVALID",
        "Reset token is invalid or expired.",
        401,
      );
    }

    // fetch credentials account password
    const credentials = await prisma.account.findFirst({
      where: {
        provider: "credentials",
        providerAccountId: user.email as string,
        userId: user.id,
      },
    });

    // check if previous password === password
    if (await bcrypt.compare(password, credentials?.password as string))
      return errorResponse(
        res,
        "Password must not be the same with previous.",
        "INVALID_PASSWORD",
        401,
      );

    const hashedPassword = await bcrypt.hash(verifiedPassword, 12);

    // Update credentials account password
    await prisma.account.updateMany({
      where: {
        userId: user.id,
        provider: "credentials",
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete used tokens
    await prisma.token.deleteMany({
      where: {
        userId: user.id,
        type: "reset_token",
      },
    });

    // Clear cookies
    res.setHeader("Set-Cookie", [
      cookie.serialize("reset_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      }),
      cookie.serialize("access_token", "", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 0,
      }),
    ]);

    return successResponse(res, "Password reset successful.", {
      email: user.email,
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return errorResponse(res, "SERVER_ERROR", "Failed to reset password.", 500);
  }
};
