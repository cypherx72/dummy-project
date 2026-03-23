import { type Response } from "express";

export const errorResponse = (
  res: Response,
  message: string,
  code: string,
  status = 400,
) => {
  return res.status(status).json({
    success: false,
    message,
    error: { code },
  });
};

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
) => {
  return res.json({
    success: true,
    message,
    data,
  });
};

/**
 * ERROR CODES
 */

export const ERROR_CODES = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TOKEN_CLEAR_FAILURE: "TOKEN_CLEAR_FAILURE",
};
