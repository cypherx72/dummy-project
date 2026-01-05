import { type PrismaClient } from "@prisma/client";

export type contextType = {
  req: any;
  res: any;
  prisma: PrismaClient;
};

export type GraphQLErrorTypes = {
  status: number;
  code: string;
  message: string;
};
