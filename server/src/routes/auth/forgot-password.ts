import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import type { Response, Request } from "express";
import { errorResponse, successResponse } from "../../utils/api-response.js";
import { AUTH_SCHEMA } from "../../utils/schema.js";
import crypto from "crypto";
import { sendEmail } from "../../utils/send-email.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    // Validate email
    const parsed = AUTH_SCHEMA.pick({ email: true }).safeParse({ email });

    // Always send generic response
    const GENERIC_RESPONSE = () =>
      successResponse(
        res,
        "If an account exists with this email, a reset link has been sent.",
      );

    if (!parsed.success) {
      return GENERIC_RESPONSE();
    }

    const verifiedEmail = parsed.data.email;

    // Check user existence
    const user = await prisma.user.findUnique({
      where: { email: verifiedEmail },
    });

    // If user doesn't exist → return masked response
    if (!user || !user.isActive) {
      return GENERIC_RESPONSE();
    }

    // Token rate limit
    const _15 = new Date(Date.now() - 15 * 60 * 1000);

    const recentTokenCount = await prisma.token.count({
      where: {
        userId: user.id,
        type: "reset_token",
        createdAt: {
          gte: _15,
        },
      },
    });

    console.log(recentTokenCount);

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
        type: "reset_token",
        expiresAt: { gt: new Date() },
      },
      data: {
        expiresAt: new Date(),
      },
    });

    // Create token record
    const tokenRecord = await prisma.token.create({
      data: {
        userId: user.id,
        type: "reset_token",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // Generate JWT
    const jwtToken = jwt.sign({ tokenId: tokenRecord.id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    // Hash before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(jwtToken)
      .digest("hex");

    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { token: hashedToken },
    });

    // Reset link
    const RESET_LINK =
      `${FRONTEND_URL}/auth/reset-password` +
      `?token=${jwtToken}&email=${encodeURIComponent(user.email as string)}`;

    await sendEmail({
      to: user.email as string,
      subject: "Reset Your CampusHub Password",
      text: `Click the link below to reset your password: ${RESET_LINK}. This link expires in 15 minutes.`,
      html: `
       <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
         <div style="text-align: center; margin-bottom: 24px;">
           <h1 style="font-size: 22px; color: #1a2332; margin: 0;">🎓 CampusHub</h1>
         </div>
         <div style="background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb;">
           <h2 style="font-size: 20px; color: #1a2332; margin: 0 0 12px;">Reset Your Account Password</h2>
         
           <a href="${RESET_LINK}" style="display: inline-block; background: #c8913a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px;">
             Reset Password
           </a>
           <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0; line-height: 1.5;">
             This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
           </p>
         </div>
         <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 16px 0 0;">
           © 2026 CampusHub · Vishwakarma University, Pune
         </p>
       </div>
     `,
    });

    return GENERIC_RESPONSE();
  } catch (error) {
    console.error("Forgot password error:", error);

    return errorResponse(res, "SERVER_ERROR", "Something went wrong.", 500);
  }
};
