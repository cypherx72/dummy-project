import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export const fetchSession = async (req: Request, res: Response) => {
  const GENERIC_UNAUTH = () =>
    res.status(401).json({
      authenticated: false,
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

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    // Mask ALL failures
    if (!user) {
      return GENERIC_UNAUTH();
    }

    // SUCCESS
    return res.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return GENERIC_UNAUTH();
  }
};
