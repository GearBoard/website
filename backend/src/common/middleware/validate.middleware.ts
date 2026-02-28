import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { errorResponse } from "../utils/response.js";

export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      next();
      return;
    }
    const first = result.error.issues[0];
    const message = first ? `${first.path.join(".")}: ${first.message}` : "Validation failed";
    res.status(400).json(errorResponse(message));
  };
}

export function validateParams<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (result.success) {
      (req as Request & { validatedParams: z.infer<T> }).validatedParams = result.data;
      next();
      return;
    }
    const first = result.error.issues[0];
    const message = first ? `${first.path.join(".")}: ${first.message}` : "Invalid params";
    res.status(400).json(errorResponse(message));
  };
}
