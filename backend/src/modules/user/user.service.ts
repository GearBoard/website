import { NotFoundError } from "../../common/errors/app-error.js";
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
    const user = await userRepository.create(data);
    return toDto(user);
  },
};
