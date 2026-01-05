import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { getSessionId } from "../../lib/auth.js";
import * as cookie from "cookie";
import { type contextType } from "../../lib/types.js";
import bcrypt from "bcryptjs";
import { formInputSchema } from "../../lib/ZodSchema.js";

type signInViaPasswordArgs = {
  input: {
    email: string;
    password: string;
  };
};

export type signInViaProviderArgs = {
  input: {
    providerId: string;
    providerAccountId: string;
    provider: string;
    type: string;
    expires_at: number;
    id_token: string;
    token_type: string;
    scope: string;
    access_token: string;
    email?: string;
  };
};

export async function SignInViaPassword(
  _: any,
  { input }: signInViaPasswordArgs,
  context: contextType
) {
  const { password: userPassword, email: userEmail } = input;
  const { req, prisma } = context;

  const { email, password } = formInputSchema.parse({
    email: userEmail,
    password: userPassword,
  });

  if (!email || !password) {
    throw GraphQLCustomLError({
      message: "User not authorized. Please recheck your credentials.",
      code: "USER_NOT_AUTHORIZED",
      status: 401,
    });
  }

  const { sessionId } = await getSessionId(req);
  console.log(sessionId);

  try {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });

    if (!session || !session.user) {
      throw GraphQLCustomLError({
        message:
          "Your session for this action is no longer active. Please start the activation process again.",
        status: 404,
        code: "SESSION_NOT_FOUND",
      });
    }

    //check if email matches up
    const isMatch = (await session.user.email) === email;
    if (!isMatch) {
      throw GraphQLCustomLError({
        message:
          "We couldn't activate your account. Please re-check your details.",
        status: 500,
        code: "ACTIVATION_FAILED",
      });
    }

    // hashing password:
    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      }),

      prisma.account.create({
        data: {
          userId: session.user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: hashedPassword,
        },
      }),
    ]);

    if (updatedUser.count === 0) {
      throw GraphQLCustomLError({
        message:
          "We couldn't activate your account. Please try again later. If this error persists, please contact our support team.",
        status: 500,
        code: "ACTIVATION_FAILED",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        registrationId: session.user.registrationId,
        phoneNumber: session.user.phoneNumber,
      },
    });

    if (!user) {
      throw GraphQLCustomLError({
        message:
          "We couldn't fetch your account data after activation. Please try again later.",
        status: 500,
        code: "FETCH_FAILED",
      });
    }
    await prisma.otp.delete({
      where: {
        userId: user.id,
      },
    });

    await prisma.session.delete({
      where: {
        userId: user.id,
      },
    });

    return {
      email: user.email,
      id: user.registrationId,
      image: user.image,
      name: user.name,
    };
  } catch (err) {
    console.error("Error in registerUser:", err);

    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message:
        "We couldn't activate your account. Please try again later. If this error persists, please contact our support team.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}

export async function SignInViaProvider(
  _: any,
  { input }: signInViaProviderArgs,
  context: contextType
) {
  const { req, res, prisma } = context;

  const { sessionId } = await getSessionId(req);

  const email = input.email;

  try {
    const session = await prisma.session.findUnique({
      where: {
        sessionToken: sessionId,
      },
      include: {
        user: true,
      },
    });

    console.log(session);
    if (!session || !session.user) {
      throw GraphQLCustomLError({
        message:
          "Your session for this action is no longer active. Please start the activation process again. If this error persists, please contact our support team.",
        status: 404,
        code: "SESSION_NOT_FOUND",
      });
    }

    const isMatch = (await session.user.email) === email;
    if (!isMatch) {
      throw GraphQLCustomLError({
        message:
          "We couldn't activate your account. Please re-check your details.",
        status: 500,
        code: "ACTIVATION_FAILED",
      });
    }
    const { email: email_, ...payload } = input;

    console.log(payload);
    const updatedUser = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      }),

      prisma.account.create({
        data: {
          userId: session.user.id,
          ...payload,
        },
      }),
    ]);

    if (updatedUser.count === 0) {
      throw GraphQLCustomLError({
        message:
          "We couldn't activate your account. Please try again later. If this error persists, please contact our support team.",
        status: 500,
        code: "ACTIVATION_FAILED",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        registrationId: session.user.registrationId,
        phoneNumber: session.user.phoneNumber,
      },
    });

    if (!user) {
      throw GraphQLCustomLError({
        message:
          "We couldn't fetch your account data after activation. Please try again later.",
        status: 500,
        code: "FETCH_FAILED",
      });
    }

    // try to delete
    await prisma.otp.delete({
      where: {
        userId: user.id,
      },
    });

    //todo : set a new session here
    await prisma.session.delete({
      where: {
        userId: user.id,
      },
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 0,
      })
    );

    return {
      email: user.email,
      id: user.registrationId,
      image: user.image,
      name: user.name,
    };
  } catch (err) {
    console.error("Error in registerUser:", err);

    if (err instanceof GraphQLError) {
      throw err;
    }

    throw GraphQLCustomLError({
      message:
        "We couldn't activate your account. Please try again later. If this error persists, please contact our support team.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}
