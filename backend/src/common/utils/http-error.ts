import type { Response } from "express";

import { AppError } from "../errors/app-error.js";
import { errorResponse } from "./response.js";

export function resolveHttpError(error: unknown): { statusCode: number; message: string } {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    message: "Internal server error",
  };
}

export function handleHttpError(res: Response, error: unknown): void {
  if (!(error instanceof AppError)) {
    console.error(error);
  }

  const { statusCode, message } = resolveHttpError(error);
  res.status(statusCode).json(errorResponse(message));
}
