import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AUTH_SCHEMA } from "../utils/schema.js";

const JWT_SECRET = process.env.JWT_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { data, success } = AUTH_SCHEMA.safeParse({ email, password });
        if (!success) return done(null, false);

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) return done(null, false);

        // Activation Flow
        if (!user.isActive) {
          const authToken = req.cookies.activation_token;
          if (!authToken) return done(null, false);

          const decoded = jwt.verify(authToken, JWT_SECRET) as {
            tokenId: string;
          };

          const tokenRecord = await prisma.token.findUnique({
            where: { id: decoded.tokenId },
          });

          if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            return done(null, false);
          }

          // Activate account

          const hashedPassword = await bcrypt.hash(password, 12);

          await prisma.account.create({
            data: {
              userId: user.id,
              type: "credentials",
              provider: "credentials",
              providerAccountId: user.email as string,
              password: hashedPassword,
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true },
          });

          await prisma.token.delete({ where: { id: tokenRecord.id } });

          return done(null, user);
        }

        // Find credentials account
        const account = await prisma.account.findFirst({
          where: {
            provider: "credentials",
            providerAccountId: data.email,
          },
          include: { user: true },
        });

        console.log(account);
        if (!account || !account.password) return done(null, false);

        // Normal Login
        const match = await bcrypt.compare(password, account.password);

        if (!match) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

//  google auth
passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:4000/auth/google/redirect",
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        console.log(email);
        if (!email) return done(null, false);

        const { data, success } = AUTH_SCHEMA.pick({ email: true }).safeParse({
          email,
        });
        if (!success) return done(null, false);

        const user = await prisma.user.findUnique({
          where: { email: data.email },
          include: { accounts: true },
        });

        if (!user) return done(null, false);

        // Activation Flow
        if (!user.isActive) {
          const authToken = req.cookies.activation_token;
          if (!authToken) return done(null, false);

          const decoded = jwt.verify(authToken, JWT_SECRET) as {
            tokenId: string;
          };

          const tokenRecord = await prisma.token.findUnique({
            where: { id: decoded.tokenId },
          });

          if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            return done(null, false);
          }

          // Create Google account
          await prisma.account.create({
            data: {
              userId: user.id,
              type: "oauth",
              provider: "google",
              providerAccountId: profile.id,
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000),
            },
          });

          // Activate user
          await prisma.user.update({
            where: { id: user.id },
            data: { isActive: true },
          });

          await prisma.token.delete({ where: { id: tokenRecord.id } });

          return done(null, user);
        }

        // Default OAuth Login

        const googleAccount = user.accounts.find(
          (acc) =>
            acc.provider === "google" && acc.providerAccountId === profile.id,
        );

        if (!googleAccount) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
