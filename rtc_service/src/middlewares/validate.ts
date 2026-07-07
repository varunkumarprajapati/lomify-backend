import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import createHttpError from "http-errors";

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      throw createHttpError(
        400,
        firstError ? firstError.message : "Validation Error",
      );
    }

    req.body = result.data;
    next();
  };
