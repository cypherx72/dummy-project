import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { formInputSchema } from "../../lib/ZodSchema.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "../../lib/otp.js";

const RESET_TOKEN = "pqe4Mqgah1FnwXoJAnxUCFMqTE1ybUMn5yJ+1jtyeWo=";

type forgotPasswordArgs = {
  input: {
    email: string;
  };
};

const emailSchema = formInputSchema.pick({ email: true });

export async function ForgotPassword(
  _: any,
  { input }: forgotPasswordArgs,
  context: contextType
) {
  const { email: userEmail } = input;
  const { prisma } = context;

  try {
    const res = emailSchema.safeParse({ email: userEmail });

    if (!res.success) {
      throw GraphQLCustomLError({
        message: "",
        status: 0,
        code: "",
      });
    }
    const email = res.data?.email;

    //check if user does exist
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      //throw 404 err
    }

    const credentials = user.accounts.find(
      (acc: { provider: string }) => acc.provider === "credentials"
    );

    if (!credentials) {
      //throw 401 unauthorized err and fail to send the email
    }

    // create a token & *store it in the db*
    // store only user email and id in the token
    const resetToken = jwt.sign(
      {
        id: credentials.id, // id of account table inorder for easy updation
        email,
      },
      RESET_TOKEN,
      {
        expiresIn: "15m",
      }
    );

    console.log(resetToken);

    const response = sendResetPasswordEmail(email, resetToken);

    if (response.status === 200) {
      return {
        message: "",
        status: 200,
        code: "EMAIL_SENT_SUCCESS",
      };
    } else {
      // throw err failed to send email & attach the error
    }
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
