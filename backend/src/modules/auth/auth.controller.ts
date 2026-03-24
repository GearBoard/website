import { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../config/auth.js";

export async function getMe(req: Request, res: Response) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
      username: (session.user as { username?: string | null }).username ?? null,
    },
  });
}

export async function logout(req: Request, res: Response) {
  try {
    const { headers } = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      returnHeaders: true,
    });

    const setCookie = headers.getSetCookie();

    if (setCookie.length > 0) {
      res.setHeader("set-cookie", setCookie);
    }

    return res.status(204).end();
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
