import { type contextType } from "../../lib/types.js";
import { GraphQLError } from "graphql";
import { GraphQLCustomLError } from "../../lib/error.js";
import jwt, { type VerifyOptions } from "jsonwebtoken";
import * as cookie from "cookie";
import { FormSchema } from "../../config/express-auth-config.js";

const JWT_SECRET_KEY = "dkafdk";

export type VerifyAuthTokenArgs = {
  auth_token: string;
  email: string;
};

export const VerifyAuthToken = async (
  _: any,
  { input }: { input: VerifyAuthTokenArgs },
  { prisma, res }: contextType,
) => {
  const { auth_token, email } = input;

  if (!auth_token || !email)
    throw GraphQLCustomLError({
      message: "Enter a valid university email (e.g. SRN@vupune.ac.in)",
      code: "INVALID_EMAIL",
      status: 403,
    });

  // validate email
  const { data, error, success } = FormSchema.pick({ email: true }).safeParse({
    email,
  });

  if (!success) throw new Error("failed to validate email.");

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    // throw error
    throw error;
  }

  try {
    // verify token & decode token

    const decodedToken = jwt.verify(
      auth_token,
      JWT_SECRET_KEY,
      (err, decodedData) => {
        if (err) {
          /*
          Handle error (e.g., token expired, invalid signature)
          */

          /**token expired */
          if (err.name === "TokenExpiredError") {
            /**issue a new token */
            //todo fix it must not be return because its inside a function
            return {
              status: 401,
              code: "EXPIRED_TOKEN",
              message: "Token Expired!",
            };
          } else {
            throw new Error(`Token verification failed:, ${err.message}`);
          }
        } else {
          // Token is valid, decodedData contains the payload
          console.log("Token is valid. Decoded data:", decodedData);
          return decodedData;
        }
      },
    );

    // search for token
    const token = await prisma.token.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!token) {
      throw GraphQLCustomLError({
        message:
          "Please re-check your credentials. If you continue to have issues registering into your account, contact our **Support team**.",
        code: "USER_NOT_FOUND",
        status: 404,
      });
    }

    console.log(token);

    // set cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth_token", auth_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      }),
    );

    return {
      status: 200,
      code: "EMAIL_SENT",
      message: email,
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
