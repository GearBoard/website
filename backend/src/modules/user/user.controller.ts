import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { userService } from "./user.service.js";

export const userController = {
  async getById(req: Request, res: Response) {
    const { id } = (req as Request & { validatedParams: { id: bigint } }).validatedParams;

    const data = await userService.getById(id);
    if (!data) {
      res.status(404).json(errorResponse("User not found"));
      return;
    }

    res.status(200).json(successResponse(data));
  },

  async create(req: Request, res: Response) {
    try {
      const data = await userService.create(req.body);
      res.status(201).json(successResponse(data));
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "P2002") {
        res.status(400).json(errorResponse("studentId, username or email already exists"));
        return;
      }
      throw e;
    }
  },
};
