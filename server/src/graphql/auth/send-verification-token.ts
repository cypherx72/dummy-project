import { type contextType } from "../../lib/types.js";
import { GraphQLError } from "graphql";
import { GraphQLCustomLError } from "../../lib/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET_KEY = "dkafdk";
const URL = "http://localhost:3000";

export type SendVerificationTokenArgs = {
  email: string;
};

export const SendVerificationToken = async (
  _: any,
  { input }: { input: SendVerificationTokenArgs },
  { prisma }: contextType,
) => {
  const { email } = input;

  if (!email)
    throw GraphQLCustomLError({
      message: "Enter a valid university email (e.g. SRN@vupune.ac.in)",
      code: "INVALID_EMAIL",
      status: 403,
    });

  //validate email

  try {
    // search for email
    const user = await prisma.user.findUnique({
      where: {
        email,
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

    if (user.isActive) {
      throw GraphQLCustomLError({
        message:
          "Please re-check your credentials. If you continue to have issues registering into your account, contact our **Support team**.",
        code: "EMAIL_ALREADY_EXISTS",
        status: 403,
      });
    }

    //todo: handle a user who request many tokens.

    // create token in db
    const token = await prisma.token.create({
      data: {
        type: "EMAIL_VERIFICATION",
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // create token
    const auth_token = jwt.sign(
      {
        id: token.id,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      },
    );

    // update & store token in prisma

    await prisma.token.update({
      where: {
        userId: user.id,
      },
      data: {
        token: auth_token,
      },
    });

    // verification link
    const VERIFICATION_LINK = `${URL}/auth/activate-account?token=${auth_token}&email=${encodeURIComponent(email)}`;

    console.log(VERIFICATION_LINK);
    /**
     *  Create a transporter using Ethereal test credentials.
     *  For production, replace with your actual SMTP server details.
     */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,

      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: "31242199@vupune.ac.in",
        pass: "bnqxpgeuurofmzqu",
      },
    });

    // Send activation link
    (async () => {
      const info = await transporter.sendMail({
        from: '"CampusHub" <31242199@vupune.ac.in>',
        to: email,
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
        // HTML version of the message
      });

      // store in prisma and return
      console.log("Message sent:", info.messageId);
    })();

    return {
      status: 200,
      code: "EMAIL_SENT",
      message: "Email sent successfully.",
    };
  } catch (err) {
    console.error("An error occurred while sending email:", err);

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
