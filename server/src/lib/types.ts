import { type PrismaClient } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";

export type contextType = {
  req: any;
  res: any;
  prisma: PrismaClient;
  cloudinary: typeof import("cloudinary").v2;
  io: SocketIOServer;
};

export type GraphQLErrorTypes = {
  status: number;
  code: string;
  message: string;
};
