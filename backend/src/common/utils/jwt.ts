import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env.js";

const ACCESS_TOKEN_EXPIRES_IN = "1h";

export interface AuthTokenPayload extends JwtPayload {
  userId?: string | number;
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
