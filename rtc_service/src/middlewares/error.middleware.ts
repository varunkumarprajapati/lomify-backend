import type { Request, NextFunction, Response } from "express";
import createHttpError from "http-errors";

export default function globalErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(error);
  if (error instanceof createHttpError.HttpError) {
    return res.status(error.status).json({
      message: error.message,
      error: error.name,
    });
  }

  if (error.code == "ER_DUP_ENTRY") {
    if (error.message.includes("username")) {
      return res.status(409).json({
        error: "CONFLICT",
        message: "Username is already in use",
      });
    }

    if (error.message.includes("email")) {
      return res.status(409).json({
        error: "CONFLICT",
        message: "Email is already in use",
      });
    }

    return res.status(409).json({
      error: "CONFLICT",
      message: "Already in use",
    });
  }

  return res.status(500).json({
    error: createHttpError(500).name,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error : null,
  });
}
