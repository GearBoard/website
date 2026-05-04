import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";
import { resolveHttpError } from "../utils/http-error.js";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (!(err instanceof AppError)) {
    console.error(err);
  }

  const { statusCode, message } = resolveHttpError(err);
  res.status(statusCode).json({ success: false, message });
}
