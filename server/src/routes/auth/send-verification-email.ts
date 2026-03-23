import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { AUTH_SCHEMA } from "../../utils/schema.js";
import { successResponse, errorResponse } from "../../utils/api-response.js";
import { sendEmail } from "../../utils/send-email.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export const sendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    // Zod validation
    const parsed = AUTH_SCHEMA.pick({ email: true }).safeParse({ email });

    if (!parsed.success) {
      return successResponse(
        res,
        "If an account exists with this email, a verification link has been sent.",
        { email },
      );
    }

    const verifiedEmail = parsed.data.email;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: verifiedEmail },
    });

    if (!user || user.isActive) {
      return successResponse(
        res,
        "If an account exists with this email, a verification link has been sent.",
        { email: verifiedEmail },
      );
    }

    // Token rate limit
    const _15 = new Date(Date.now() - 15 * 60 * 1000);

    const recentTokenCount = await prisma.token.count({
      where: {
        userId: user.id,
        type: "activation_token",
        createdAt: {
          gte: _15,
        },
      },
    });

    if (recentTokenCount >= 4)
      return successResponse(
        res,
        "If an account exists with this email, a verification link has been sent.",
        { email: verifiedEmail },
      );

    //expire exising tokens

    await prisma.token.updateMany({
      where: {
        userId: user.id,
        type: "activation_token",
        expiresAt: { gt: new Date() },
      },
      data: {
        expiresAt: new Date(),
      },
    });

    // Delete old tokens
    await prisma.token.deleteMany({
      where: {
        userId: user.id,
        type: "activation_token",
        expiresAt: { lt: new Date() },
      },
    });

    // Create token record
    const tokenRecord = await prisma.token.create({
      data: {
        userId: user.id,
        type: "activation_token",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Generate JWT
    const jwtToken = jwt.sign({ tokenId: tokenRecord.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Hash token before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(jwtToken)
      .digest("hex");

    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { token: hashedToken },
    });

    // Activation link
    const VERIFICATION_LINK =
      `${FRONTEND_URL}/auth/activate-account` +
      `?token=${jwtToken}&email=${encodeURIComponent(user.email as string)}`;

    console.log(VERIFICATION_LINK);

    sendEmail({
      to: user.email as string,
      subject: "Activate Your CampusHub Account",
      text: `Welcome to CampusHub! Click the link below to activate your account: ${VERIFICATION_LINK}. This link expires in 24 hours. If you didn't request this, please ignore this email.`,
      html: `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 22px; color: #1a2332; margin: 0;">🎓 CampusHub</h1>
    </div>
    <div style="background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb;">
      <h2 style="font-size: 20px; color: #1a2332; margin: 0 0 12px;">Activate Your Account</h2>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
        Welcome! You're one step away from accessing your university portal. Click the button below to verify your email and activate your account.
      </p>
      <a href="${VERIFICATION_LINK}" style="display: inline-block; background: #c8913a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px;">
        Activate Account
      </a>
      <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0; line-height: 1.5;">
        This link expires in 24 hours. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 16px 0 0;">
      © 2026 CampusHub · Vishwakarma University, Pune
    </p>
  </div>
`,
    });

    return successResponse(res, "Verification email sent successfully.");
  } catch (error) {
    console.error("Send verification token error:", error);

    return errorResponse(
      res,
      "Failed to send verification email.",
      "SERVER_ERROR",
      500,
    );
  }
};
