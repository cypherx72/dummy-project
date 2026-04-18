import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

import type { User } from "../../types.js";
import { errorResponse, successResponse } from "../../utils/api-response.js";

// Google Redirect
export const googleSignin = (req: Request, res: Response) => {
  const user = req.user as User | undefined;

  if (!user) {
    return errorResponse(
      res,
      "Invalid credentials.",
      "INVALID_CREDENTIALS",
      401,
    );
  }
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      image: user.image,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return successResponse(res, "Authentication processed.", {
    authenticated: true,
  });
};

// Credentials Redirect
export const credentialsSignIn = (req: Request, res: Response) => {
  const user = req.user as User | false;

  if (!user) {
    return errorResponse(
      res,
      "Invalid credentials.",
      "INVALID_CREDENTIALS",
      401,
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      image: user.image,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return successResponse(res, "Authentication processed.", {
    authenticated: true,
  });
};
