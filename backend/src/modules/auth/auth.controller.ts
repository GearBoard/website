import { Request, Response } from "express";
import { successResponse } from "../../common/utils/response.js";
import { handleHttpError } from "../../common/utils/http-error.js";
import { authService } from "./auth.service.js";

export async function getMe(req: Request, res: Response) {
  try {
    const user = await authService.getCurrentUser(req.headers);
    return res.status(200).json(successResponse(user));
  } catch (error) {
    handleHttpError(res, error);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const setCookie = await authService.signOut(req.headers);
    if (setCookie.length > 0) {
      res.setHeader("set-cookie", setCookie);
    }
    return res.status(204).end();
  } catch (error) {
    handleHttpError(res, error);
  }
}
