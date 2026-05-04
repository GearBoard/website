import type { IncomingHttpHeaders } from "http";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../../config/auth.js";
import { UnauthorizedError } from "../../common/errors/app-error.js";

export interface CurrentUserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  username: string | null;
}

export const authService = {
  async getCurrentUser(headers: IncomingHttpHeaders): Promise<CurrentUserProfile> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
      username: (session.user as { username?: string | null }).username ?? null,
    };
  },
};
