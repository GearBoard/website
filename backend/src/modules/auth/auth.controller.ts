import type { Request, Response } from "express";
import { successResponse } from "../../common/utils/response.js";
import { authService } from "./auth.service.js";

export const authController = {
  async login(req: Request, res: Response) {
    const data = await authService.login(req.body);
    res.status(200).json(successResponse(data, "Login successful"));
  },
  async register(req: Request, res: Response) {
    const data = await authService.register(req.body);
    res.status(201).json(successResponse(data, "User registered"));
  },
};
