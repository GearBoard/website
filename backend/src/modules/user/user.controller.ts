import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import type { CreateUserRequestDto } from "./user.dto.js";
import { toUserResponseDto } from "./user.dto.js";
import { userService } from "./user.service.js";

export const userController = {
  // Get user by id
  async getById(req: Request, res: Response) {
    const idStr = req.params.id;
    const id = BigInt(idStr);

    if (id < 1) {
      res.status(400).json(errorResponse("Invalid user id"));
      return;
    }

    const user = await userService.getById(id);
    if (!user) {
      res.status(404).json(errorResponse("User not found"));
      return;
    }

    const data = toUserResponseDto(user);
    res.status(200).json(successResponse(data, "User found"));
  },

  // Create user
  async create(req: Request, res: Response) {
    const body = req.body as CreateUserRequestDto;

    const { studentId, username, email, role } = body;
    if (!studentId?.trim() || !username?.trim() || !email?.trim() || !role?.trim()) {
      res.status(400).json(errorResponse("studentId, username, email and role are required"));
      return;
    }

    const dto: CreateUserRequestDto = {
      studentId: studentId.trim(),
      username: username.trim(),
      email: email.trim(),
      role: role.trim(),
      profileURL: body.profileURL ?? null,
      description: body.description ?? null,
      departmentId: body.departmentId ?? null,
    };

    try {
      const user = await userService.create(dto);
      const data = toUserResponseDto(user);

      res.status(201).json(successResponse(data, "User created"));
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
