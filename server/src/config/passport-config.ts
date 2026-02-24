import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { FormSchema } from "./express-auth-config.js";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

export const JWT_SECRET_KEY = "dkafdk";

// authenticating with credentials

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { data, success, error } = FormSchema.safeParse({
        email,
        password,
      });

      if (!success) {
        console.log(error);
        return done(error, false);
      }

      const verifiedEmail = data.email;
      const verifiedPassword = data.password;

      // verify user
      const verifiedUser = await prisma.user.findUnique({
        where: {
          email: verifiedEmail,
        },
      });

      if (!verifiedUser) return done(null, false);

      if (!verifiedUser.isActive) {
        const authToken = req.cookies["auth_token"];
        if (!authToken) return done(null, false);
        console.log(authToken);

        console.log("hedlk");
        // verify token
        const verfiedAuthToken = jwt.verify(authToken, JWT_SECRET_KEY) as {
          id: string;
        };

        console.log(verfiedAuthToken);

        const tokenRecord = await prisma.token.findFirst({
          where: {
            id: verfiedAuthToken.id,
            expiresAt: { gt: new Date() },
          },
        });

        if (!tokenRecord) return done(null, false);

        const passwordHash = await bcrypt.hash(verifiedPassword, 12);

        // set google oauth credentials
        await prisma.user.update({
          data: {
            password: passwordHash,
            isActive: true,
          },
          where: {
            email: verifiedEmail,
          },
        });

        // Delete used token
        await prisma.token.delete({
          where: { id: tokenRecord.id },
        });

        return done(null, verifiedUser);
      }

      const isMatch = await bcrypt.compare(
        password,
        verifiedUser.password as string,
      );

      if (!isMatch) return done(null, false);

      return done(null, verifiedUser);
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      callbackURL: "/auth/google/redirect",
      clientID:
        "655956092358-jbek61e6prk5makcqbrgt9qkpb8rlukv.apps.googleusercontent.com",
      clientSecret: "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",
      passReqToCallback: true,
    },
    // passport callback function
    async (req, accessToken, refreshToken, profile, done) => {
      if (!profile?.emails?.[0]?.value) return done(null, false);

      // verify profile
      const verifiedEmail = FormSchema.pick({ email: true }).safeParse({
        email: profile.emails[0].value,
      });

      if (!verifiedEmail.success) {
        return done(null, false);
      }

      const email = verifiedEmail.data?.email;

      // verify user
      const verifiedUser = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          accounts: true,
        },
      });

      if (!verifiedUser) return done(null, false);

      if (!verifiedUser.isActive) {
        const authToken = req.cookies["auth_token"];

        if (!authToken) return done(null, false);

        // verify token
        const verfiedAuthToken = jwt.verify(authToken, JWT_SECRET_KEY) as {
          id: string;
        };

        const tokenRecord = await prisma.token.findFirst({
          where: {
            id: verfiedAuthToken.id,
            expiresAt: { gt: new Date() },
          },
        });

        if (!tokenRecord) return done(null, false);

        // set google oauth credentials
        await prisma.account.create({
          data: {
            userId: verifiedUser.id,
            type: "oauth",
            token_type: "bearer",
            access_token: accessToken,
            refresh_token: refreshToken,
            provider: profile.provider,
            providerAccountId: profile.id,
            expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000),
            scope: "profile",
          },
        });

        // activate user
        await prisma.user.update({
          data: {
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

        return done(null);
      }
      verifiedUser;

      // verify providerAccountId
      if (
        verifiedUser.accounts.find((acc) => acc.provider === "google")
          ?.providerAccountId === profile.id
      )
        return done(null, verifiedUser);

      return done(null, false);
    },
  ),
);
