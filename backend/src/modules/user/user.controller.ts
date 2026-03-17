import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { userService } from "./user.service.js";
import type { AuthenticatedRequest } from "../../common/types/index.js";
import type { GetUsersQueryDto, UpdateUserRequestDto } from "./user.dto.js";

export const userController = {
  async getById(req: Request, res: Response) {
    const { id } = (req as Request & { validatedParams: { id: string } }).validatedParams;
    const authReq = req as AuthenticatedRequest;

    if (authReq.user.id !== id && authReq.user.role !== "ADMIN") {
      res.status(403).json(errorResponse("Forbidden"));
      return;
    }

    const data = await userService.getById(id);
    if (!data) {
      res.status(404).json(errorResponse("User not found or deleted"));
      return;
    }

    res.status(200).json(successResponse(data));
  },

  async findMany(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user.role !== "ADMIN") {
      res.status(403).json(errorResponse("Forbidden: Admins only"));
      return;
    }

    const query = (req as Request & { validatedQuery: GetUsersQueryDto }).validatedQuery;
    const data = await userService.findMany(query);
    res.status(200).json(successResponse(data));
  },

  async update(req: Request, res: Response) {
    const { id } = (req as Request & { validatedParams: { id: string } }).validatedParams;
    const authReq = req as AuthenticatedRequest;
    const body = req.body as UpdateUserRequestDto;

    if (authReq.user.id !== id && authReq.user.role !== "ADMIN") {
      res.status(403).json(errorResponse("Forbidden"));
      return;
    }

    try {
      const existingUser = await userService.getById(id);
      if (!existingUser) {
        res.status(404).json(errorResponse("User not found"));
        return;
      }

      const updated = await userService.update(id, body);
      res.status(200).json(successResponse(updated));
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "P2025") {
        res.status(404).json(errorResponse("User not found"));
        return;
      }
      throw e;
    }
  },

  async softDelete(req: Request, res: Response) {
    const { id } = (req as Request & { validatedParams: { id: string } }).validatedParams;
    const authReq = req as AuthenticatedRequest;

    if (authReq.user.role !== "ADMIN") {
      res.status(403).json(errorResponse("Forbidden: Admins only"));
      return;
    }

    try {
      const existingUser = await userService.getById(id);
      if (!existingUser) {
        res.status(404).json(errorResponse("User not found"));
        return;
      }

      await userService.softDelete(id);
      res.status(200).json(successResponse({ success: true }));
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "P2025") {
        res.status(404).json(errorResponse("User not found"));
        return;
      }
      throw e;
    }
  },
};
