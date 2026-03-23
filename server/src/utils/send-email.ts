import nodemailer from "nodemailer";
import type { EmailArgs } from "../types.js";

export const sendEmail = async ({ to, html, text, subject }: EmailArgs) => {
  // Email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"CampusHub" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });
};
