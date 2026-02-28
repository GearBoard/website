import type { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // TODO: verify JWT and attach user to req
  next();
}
