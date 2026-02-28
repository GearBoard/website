import type { CreateUserRequestDto, UserResponseDto } from "./user.dto.js";
import { toDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getById(id: bigint): Promise<UserResponseDto | null> {
    const user = await userRepository.findById(id);
    return user ? toDto(user) : null;
  },

  async create(data: CreateUserRequestDto): Promise<UserResponseDto> {
    const user = await userRepository.create(data);
    return toDto(user);
  },
};
