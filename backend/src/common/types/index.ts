// Shared types for auth and request

import type { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  role?: string;
  email?: string;
  username?: string;
}

/** Request with authenticated user (use in protected route handlers) */
export type AuthenticatedRequest = Request & { user: AuthenticatedUser };
