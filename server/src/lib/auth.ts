import jwt from "jsonwebtoken";
import { GraphQLCustomLError } from "./error.js";
import { GraphQLError } from "graphql";

const AUTH_SECRET = process.env.AUTH_SECRET!;

export async function getSessionId(req: any) {
  const authHeader = req.headers.authorization || req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw GraphQLCustomLError({
      message:
        "Your session for this action is no longer active. Please start the activation process again.",
      status: 403,
      code: "TOKEN_NOT_FOUND",
    });
  }

  try {
    const decodedToken = jwt.verify(token, AUTH_SECRET as string);

    if (!decodedToken || typeof decodedToken !== "object") {
      throw GraphQLCustomLError({
        message:
          "Your session for this action is no longer active. Please start the activation process again. If this error persists, please contact our support team.",
        status: 403,
        code: "TOKEN_DECODE_FAILED",
      });
    }

    return decodedToken;
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message:
        "Something went wrong. If this error persists, please contact our support team.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
