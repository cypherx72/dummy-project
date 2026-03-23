import express from "express";
import passport from "passport";
import { credentialsSignIn, googleSignin } from "./auth/signin.js";
import { fetchSession } from "./auth/fetch-session-data.js";
import { sendVerificationEmail } from "./auth/send-verification-email.js";
import { verifyToken } from "./auth/verify-token.js";
import { clearToken } from "./auth/clear-token.js";
import { resetPassword } from "./auth/reset-password.js";
import { forgotPassword } from "./auth/forgot-password.js";
import "../config/passport-config.js";

const router = express.Router();

// Google Signin
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Google Redirect
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
  }),
  googleSignin,
);

// Credentials Signin
router.post(
  "/credentials",
  passport.authenticate("local", {
    session: false,
  }),
  credentialsSignIn,
);

router.get("/session", fetchSession);
router.post("/activate-account", sendVerificationEmail);
router.post("/verify-token", verifyToken);
router.post("/clear-auth-token", clearToken);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

export default router;
