import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "../config/passport-config.js";
import { JWT_SECRET_KEY } from "../config/passport-config.js";

const router = express.Router();

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}
// Start Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const user = req.user as User;
    console.log(user);

    // user session
    const token = jwt.sign(
      {
        userId: user?.id,
        email: user?.email,
        image: user.image,
        role: user.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000/dashboard");
  },
);

router.post(
  "/credentials",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const user = req.user as User;
    console.log(user);

    // user session
    const token = jwt.sign(
      {
        userId: user?.id,
        email: user?.email,
        image: user.image,
        role: user.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000/dashboard");
  },
);

router.get("/session", (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    return res.json({
      user: decoded,
    });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ code: "TOKEN_EXPIRED" });
    }

    return res.status(401).json({ code: "INVALID_TOKEN" });
  }
});

export default router;
