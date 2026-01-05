import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { formInputSchema } from "../../lib/ZodSchema.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

const RESET_TOKEN = "pqe4Mqgah1FnwXoJAnxUCFMqTE1ybUMn5yJ+1jtyeWo=";
type resetPasswordArgs = {
  input: {
    password: string;
    token: string;
  };
};

const passwordSchema = formInputSchema.pick({ password: true });

export async function ResetPassword(
  _: any,
  { input }: resetPasswordArgs,
  context: contextType
) {
  const { token, password: userPassword } = input;
  const { prisma } = context;

  try {
    const res = passwordSchema.safeParse({ password: userPassword });

    if (!res.success || !res.data.password) {
      throw GraphQLCustomLError({
        message: " hi",
        status: 200,
        code: "dfs",
      });
    }

    console.log(token);
    //decode token
    const decodedToken = jwt.verify(token, RESET_TOKEN);
    console.log(decodedToken);
    if (!decodedToken || !decodedToken.email || decodedToken.id) {
      // throw err
    }

    //hash password
    const password = res.data?.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);

    // updating the credentials field in the db

    const updatedAcc = await prisma.account.update({
      data: {
        providerAccountId: hashedPassword,
      },
      where: {
        id: decodedToken.id,
      },
    });

    if (!updatedAcc) {
      // thrwo err
    }

    if (updatedAcc.count === 0) {
      // throw error, previous pwd
      //Your new password does not meet our security requirements. Please choose a different password.
    }

    return {
      message: "",
      code: "PASSWORD_RESET_SUCCESS",
      status: 200,
    };
  } catch (err) {
    console.error("Error in forgot passoword:", err);

    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message:
        "We couldn't activate your account. Please try again later. If this error persists, please contact our **support team**.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
