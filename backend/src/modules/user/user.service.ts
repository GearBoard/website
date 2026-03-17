import type {
  GetUsersQueryDto,
  PaginatedUserResponseDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from "./user.dto.js";
import { toDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getById(id: string): Promise<UserResponseDto | null> {
    const user = await userRepository.findById(id);
    return user ? toDto(user) : null;
  },

  async findMany(query: GetUsersQueryDto): Promise<PaginatedUserResponseDto> {
    const { items, total } = await userRepository.findMany(query);
    const { page, limit } = query;

    return {
      items: items.map(toDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async update(id: string, data: UpdateUserRequestDto): Promise<UserResponseDto> {
    const user = await userRepository.update(id, data);
    return toDto(user);
  },

  async softDelete(id: string): Promise<UserResponseDto> {
    const user = await userRepository.softDelete(id);
    return toDto(user);
  },
};
