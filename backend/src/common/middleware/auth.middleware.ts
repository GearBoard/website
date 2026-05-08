import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../../config/auth.js";
import type { AuthenticatedRequest } from "../types/index.js";
import { errorResponse } from "../utils/response.js";
import { userRepository } from "../../modules/user/user.repository.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    const dbUser = await userRepository.findById(session.user.id);

    if (!dbUser) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: dbUser.id,
      name: dbUser.name,
      image: dbUser.image ?? null,
      role: dbUser.role,
      email: dbUser.email,
      username: dbUser.username ?? null,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  if (authReq.user?.role !== "ADMIN") {
    res.status(403).json(errorResponse("Forbidden"));
    return;
  }
  next();
}
