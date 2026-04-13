import { Server as SocketIOServer } from "socket.io";
import type { Request, Response } from "express";
import type { PrismaClient } from "../../generated/prisma/index.js";

// The shape of the authenticated user — mirrors the Prisma User model fields
// that authMiddleware guarantees will be present on req.user
export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: "student" | "teacher" | "admin";
  isActive: boolean;
};

export type contextType = {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  cloudinary: typeof import("cloudinary").v2;
  io: SocketIOServer;
  // Typed current user — populated by authMiddleware, always present on
  // authenticated routes. Will be null if the request somehow bypasses auth.
  currentUser: AuthUser;
};

export type GraphQLErrorTypes = {
  status: number;
  code: string;
  message: string;
};
