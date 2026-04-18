import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const fetchSession = async (req: Request, res: Response) => {
  const GENERIC_UNAUTH = () =>
    res.status(401).json({
      message: "Your session has expired. Please sign-in in again to continue.",
      code: "AUTHENTICATION_FAILED",
    });

  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return GENERIC_UNAUTH();
    }

    // Verify JWT
    let decoded: { userId: string };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return GENERIC_UNAUTH();
    }

    if (!decoded) {
      return GENERIC_UNAUTH();
    }

    return res.json({
      user: decoded,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return GENERIC_UNAUTH();
  }
};
