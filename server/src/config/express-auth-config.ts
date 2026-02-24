import { PrismaAdapter } from "@auth/prisma-adapter";
import { ExpressAuth, type ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import Credentials from "@auth/express/providers/credentials";
import { prisma } from "../lib/prisma.js";
import LinkedIn from "@auth/express/providers/linkedin";
import bcrypt from "bcryptjs";
import z from "zod";
import { profileEnd } from "console";

export const FormSchema = z.object({
  email: z.string().regex(/^\d{8}@vupune\.ac\.in$/, {
    message: "Enter a valid university email",
  }),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+-=\[\]\\{}|;':",.<>\/?]).{8,}$/,
      {
        message:
          "Password must contain uppercase, lowercase, number, and special character.",
      },
    ),
});

export const authConfig: ExpressAuthConfig = {
  trustHost: true,
  secret: "your-new-shared-random-secret",
  cookies: {
    sessionToken: {
      options: {
        sameSite: "none" as const,
        httpOnly: true,
        secure: false,
      },
    },
    csrfToken: {
      options: {
        sameSite: "none" as const,
        secure: false,
      },
    },
    pkceCodeVerifier: {
      options: {
        httpOnly: true,
        sameSite: "none" as const,
        secure: false,
        maxAge: 15 * 60, // 15 minutes as per spec
      },
    },
  },
  providers: [
    Google,
    LinkedIn,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials, request) => {
        console.log(credentials);
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // validate email & password
        const { data, success, error } = FormSchema.safeParse({
          email,
          password,
        });
        if (!success) return null;
        if (error) return null;

        // verify user
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) return null;

        if (!user.isActive) {
          const cookies = Object.fromEntries(
            (request.headers.get("cookie") || "")
              .split("; ")
              .map((c) => c.split("=")),
          );

          const authToken = cookies.auth_token;
          console.log(authToken, " ", new Date());

          if (!authToken) {
            return null;
          }

          const tokenRecord = await prisma.token.findFirst({
            where: {
              id: authToken,
              expiresAt: { gt: new Date() },
            },
          });

          if (!tokenRecord) {
            return null; // Invalid token
          }

          const passwordHash = await bcrypt.hash(password, 12);

          const user = await prisma.user.update({
            data: {
              password: passwordHash,
              isActive: true,
            },
            where: {
              email,
            },
          });

          // Delete used token
          await prisma.token.delete({
            where: { id: tokenRecord.id },
          });

          return {
            id: user.id,
            email: user.email,
            image: user.image,
            name: user.name,
          };
        }

        // check against credentials provided

        if (!user.password) return null;
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return null;

        return {
          id: user.id,
          email: user.email,
          image: user.image,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      console.log(user, account, profile);

      if (!user || !user.email || !profile?.email_verified) return false;

      // validate email
      const valid = FormSchema.pick({ email: true }).safeParse({
        email: user.email,
      }).success;
      console.log(valid);

      if (!valid) return false;

      // verify user
      const verified_user = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!verified_user || !verified_user.isActive) return false;

      return true;
    },

    async session({ session, token }) {
      // fetch any info that you want in the db and attach it to the user object

      console.log("in session: ", token);

      // confirm session object first which is client side

      session.userId = token.userId as string;

      console.log("lkd", session.userId);
      return session;
    },

    async jwt({ token }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      console.log("in token", token);

      const userSession = await prisma.user.findUnique({
        where: {
          email: token.email as string,
        },
        select: {
          id: true,
          role: true,
          password: false,
          name: true,
          image: true,
          email: true,
        },
      });

      token.userId = userSession?.id as string;
      token.role = userSession?.role;

      return token;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs or those on the frontend origin
      if (url.startsWith("http://localhost:3000")) return url;
      return "http://localhost:3000/dashboard";
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60 * 24,
    updateAge: 60 * 60 * 3,
  },
};
