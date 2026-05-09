import type { Request, Response } from "express";
import { successResponse } from "../../common/utils/response.js";
import { handleHttpError } from "../../common/utils/http-error.js";
import type { AuthenticatedRequest } from "../../common/types/index.js";
import { userService } from "./user.service.js";
import type { GetAllUsersQuery, GetUserByIdParams } from "./user.schema.js";

export const userController = {
  async getMe(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = await userService.getById(authReq.user.id, authReq.user.id, authReq.user.role);
      res.status(200).json(successResponse(data));
    } catch (error) {
      handleHttpError(res, error);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest & { validatedParams: GetUserByIdParams };
      const { id } = authReq.validatedParams;
      const data = await userService.getById(id, authReq.user.id, authReq.user.role);
      res.status(200).json(successResponse(data));
    } catch (error) {
      handleHttpError(res, error);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const query = (req as Request & { validatedQuery: GetAllUsersQuery }).validatedQuery;
      const result = await userService.getAll(query);
      res.status(200).json(successResponse(result));
    } catch (error) {
      handleHttpError(res, error);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest & { validatedParams: GetUserByIdParams };
      const { id } = authReq.validatedParams;
      const result = await userService.update(id, req.body, authReq.user.id, authReq.user.role);
      res.status(200).json(successResponse(result));
    } catch (error) {
      handleHttpError(res, error);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest & { validatedParams: GetUserByIdParams };
      const { id } = authReq.validatedParams;
      await userService.delete(id, authReq.user.id, authReq.user.role);
      res.status(200).json(successResponse({ message: "User deleted successfully" }));
    } catch (error) {
      handleHttpError(res, error);
    }
  },
};
