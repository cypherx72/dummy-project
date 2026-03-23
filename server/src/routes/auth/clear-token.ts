import type { Request, Response, NextFunction } from "express";
import {
  errorResponse,
  successResponse,
  ERROR_CODES,
} from "../../utils/api-response.js";

export const clearToken = (req: Request, res: Response, next: NextFunction) => {
  const type = req.body.type;

  try {
    res.clearCookie(type, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return successResponse(res, "Token cleared successfully. ");
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      "Failed to clear authentication token. ",
      ERROR_CODES.TOKEN_CLEAR_FAILURE,
      500,
    );
  }
};
