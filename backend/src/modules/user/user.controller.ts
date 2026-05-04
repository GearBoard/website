import type { Request, Response } from "express";
import { successResponse } from "../../common/utils/response.js";
import { handleHttpError } from "../../common/utils/http-error.js";
import { userService } from "./user.service.js";

export const userController = {
  async getById(req: Request, res: Response) {
    try {
      const { id } = (req as Request & { validatedParams: { id: string } }).validatedParams;
      const data = await userService.getById(id);
      res.status(200).json(successResponse(data));
    } catch (error) {
      handleHttpError(res, error);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await userService.create(req.body);
      res.status(201).json(successResponse(data));
    } catch (error) {
      handleHttpError(res, error);
    }
  },
};
