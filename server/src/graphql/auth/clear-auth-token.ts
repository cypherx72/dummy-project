import { type contextType } from "../../lib/types.js";
import { GraphQLError } from "graphql";
import { GraphQLCustomLError } from "../../lib/error.js";
import * as cookie from "cookie";
export const ClearAuthToken = async (_: any, __: any, { res }: contextType) => {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 0,
      }),
    );

    return {
      status: 200,
      message: "Auth token cleared",
      code: "SUCCESS",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    throw GraphQLCustomLError({
      message: "Server error while clearing token",
      code: "SERVER_ERROR",
      status: 500,
    });
  }
};
