import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../../config/auth.js";
import type { AuthenticatedRequest } from "../types/index.js";
import { errorResponse } from "../utils/response.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: session.user.id,
      name: session.user.name,
      image: session.user.image ?? null,
      email: session.user.email,
      username: (session.user as { username?: string | null }).username ?? null,
    };

    next();
  } catch (error) {
    next(error);
  }
}
