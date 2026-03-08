import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { AuthenticatedUser } from "../types/index.js";

type RequestWithUser = Request & { user?: AuthenticatedUser };

const UNAUTHORIZED_MESSAGE = { error: "Unauthorized" };

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json(UNAUTHORIZED_MESSAGE);
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json(UNAUTHORIZED_MESSAGE);
    return;
  }

  try {
    const payload = verifyToken(token);

    let id: string | undefined;
    if (typeof payload.userId === "string") {
      id = payload.userId;
    } else if (typeof payload.userId === "number") {
      id = String(payload.userId);
    } else if (typeof payload.sub === "string") {
      id = payload.sub;
    }

    if (!id) {
      res.status(401).json(UNAUTHORIZED_MESSAGE);
      return;
    }

    const user: AuthenticatedUser = {
      id,
      // Optional fields if present on the token payload
      role: typeof payload.role === "string" ? payload.role : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      username: typeof payload.username === "string" ? payload.username : undefined,
    };

    req.user = user;

    next();
  } catch {
    res.status(401).json(UNAUTHORIZED_MESSAGE);
  }
}
