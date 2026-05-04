// Shared types for auth and request

import type { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  name: string;
  image: string | null;
  role?: string;
  email: string;
  username: string | null;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

/** Request with authenticated user (use in protected route handlers) */
export type AuthenticatedRequest = Request & { user: AuthenticatedUser };
