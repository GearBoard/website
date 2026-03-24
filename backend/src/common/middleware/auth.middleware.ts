import type { Request, Response, NextFunction } from "express";
import { auth } from "../../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";

import type { AuthenticatedRequest } from "../types/index.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    (req as AuthenticatedRequest).user = session.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
