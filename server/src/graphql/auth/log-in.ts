import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import bcrypt from "bcryptjs";
import { formInputSchema } from "../../lib/ZodSchema.js";
import type { signInViaProviderArgs } from "./sign-in.js";

type logInViaPasswordArgs = {
  input: {
    email: string;
    password: string;
  };
};

const emailSchema = formInputSchema.pick({ email: true });

export async function LogInViaPassword(
  _: any,
  { input }: logInViaPasswordArgs,
  context: contextType
) {
  const { password, email: userEmail } = input;
  const { prisma } = context;

  try {
    const { email } = emailSchema.parse({ email: userEmail });
    console.log(email);

    if (!email || !password) {
      throw GraphQLCustomLError({
        message: "User not authorized. Please recheck your credentials.",
        code: "WRONG_EMAIL",
        status: 401,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    });

    if (!user || !user.emailVerified) {
      throw GraphQLCustomLError({
        message: "User not authorized. Please recheck your credentials.",
        code: "USER_NOT_FOUND",
        status: 404,
      });
    }

    const credentialsAcc = user.accounts.find(
      (acc: { provider: string }) => acc.provider === "credentials"
    );
    const result = await bcrypt.compare(
      password,
      credentialsAcc.providerAccountId
    );

    if (result) {
      return {
        email: user.email,
        id: user.registrationId,
        image: user.image,
        name: user.name,
      };
    } else {
      throw GraphQLCustomLError({
        status: 401,
        message: "User not authorized. Please recheck your credentials.",
        code: "USER_NOT_AUTHORIZED",
      });
    }
  } catch (err) {
    console.error("Error in log-in user:", err);

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

export async function LogInViaProvider(
  _: any,
  { input }: signInViaProviderArgs,
  context: contextType
) {
  const { prisma } = context;
  const { providerAccountId, provider, email } = input;

  try {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    // if user is verified with no account then add the details like wise
    if (!account) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !user.emailVerified) {
        throw GraphQLCustomLError({
          message: "User not authorized. Please recheck your credentials.",
          code: "USER_NOT_FOUND",
          status: 404,
        });
      }

      const { email: email_, ...payload } = input;

      // set the details for auth next time
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          ...payload,
        },
        include: {
          user: true,
        },
      });

      console.log(account);

      return {
        email: account.user.email,
        id: account.user.registrationId,
        image: account.user.image,
        name: account.user.name,
      };
    }

    if (
      providerAccountId === account.providerAccountId &&
      provider === account.provider
    ) {
      return {
        email: account.user.email,
        id: account.user.registrationId,
        image: account.user.image,
        name: account.user.name,
      };
    }
  } catch (err) {
    console.error("Error in registerUser:", err);

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
