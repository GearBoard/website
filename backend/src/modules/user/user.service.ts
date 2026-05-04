import { Prisma } from "../../../generated/prisma/client.js";
import { ConflictError, NotFoundError } from "../../common/errors/app-error.js";
import type { CreateUserRequestDto, UserResponseDto } from "./user.dto.js";
import { toDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getById(id: string): Promise<UserResponseDto> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return toDto(user);
  },

  async create(data: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      const user = await userRepository.create(data);
      return toDto(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("User with this email or username already exists");
      }

      throw error;
    }
  },
};
