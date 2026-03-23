import { type PrismaClient } from "@prisma/client/extension";
import { Server as SocketIOServer } from "socket.io";
import type { Request, Response } from "express";

export type contextType = {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  cloudinary: typeof import("cloudinary").v2;
  io: SocketIOServer;
};

export type GraphQLErrorTypes = {
  status: number;
  code: string;
  message: string;
};
