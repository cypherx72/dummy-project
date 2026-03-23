import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { prisma } from "../../lib/prisma.js";
import { AUTH_SCHEMA } from "../../utils/schema.js";
import { successResponse, errorResponse } from "../../utils/api-response.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET!;
const GENERIC_AUTH_ERROR = "Invalid or expired verification link.";

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token, email, type } = req.body;

    // Basic input check
    if (!token || !email || !type) {
      return errorResponse(res, "AUTH_FAILED", GENERIC_AUTH_ERROR, 400);
    }

    // Validate email
    const validation = AUTH_SCHEMA.pick({ email: true }).safeParse({ email });

    if (!validation.success) {
      return errorResponse(res, "AUTH_FAILED", GENERIC_AUTH_ERROR, 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(res, "AUTH_FAILED", GENERIC_AUTH_ERROR, 400);
    }

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    } catch {
      return errorResponse(res, "AUTH_FAILED", GENERIC_AUTH_ERROR, 400);
    }

    // Check DB token
    const tokenRecord = await prisma.token.findFirst({
      where: {
        id: decodedToken.tokenId,
        userId: user.id,
        type,
        expiresAt: { gt: new Date() },
      },
    });

    console.log(tokenRecord);

    if (!tokenRecord) {
      return errorResponse(res, "AUTH_FAILED", GENERIC_AUTH_ERROR, 400);
    }

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(type, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: type === "auth_token" ? 24 * 60 * 60 : 60 * 15,
      }),
    );

    return successResponse(res, "Verification successful.", {
      email: user.email,
    });
  } catch (error) {
    console.error("Verify auth token error:", error);

    return errorResponse(
      res,
      "AUTH_FAILED",
      "Invalid or expired verification link.",
      400,
    );
  }
};
