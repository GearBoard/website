import { Prisma } from "../../../generated/prisma/client.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../common/errors/app-error.js";
import type {
  CreateUserRequestDto,
  GetAllUsersQuery,
  UpdateUserRequestDto,
  UserPaginatedDto,
  UserResponseDto,
} from "./user.dto.js";
import { toDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";
import { getSkipTake } from "../../common/utils/pagination.js";

export const userService = {
  async getById(id: string, requesterId: string, requesterRole: string): Promise<UserResponseDto> {
    if (requesterId !== id && requesterRole !== "ADMIN") {
      throw new ForbiddenError("Forbidden");
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return toDto(user);
  },

  async getAll(query: GetAllUsersQuery): Promise<UserPaginatedDto> {
    const { skip, take } = getSkipTake(query.page, query.limit);

    const { users, total } = await userRepository.findMany({
      skip,
      take,
      search: query.search,
      role: query.role,
      departmentId: query.departmentId,
    });

    return {
      data: users.map(toDto),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
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

  async update(
    id: string,
    data: UpdateUserRequestDto,
    requesterId: string,
    requesterRole: string
  ): Promise<UserResponseDto> {
    if (requesterId !== id && requesterRole !== "ADMIN") {
      throw new ForbiddenError("Forbidden");
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    try {
      const updated = await userRepository.update(id, data);
      if (!updated) {
        throw new NotFoundError("User not found");
      }
      return toDto(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("Username already taken");
      }
      throw error;
    }
  },

  async delete(id: string, requesterId: string, requesterRole: string): Promise<void> {
    if (requesterId !== id && requesterRole !== "ADMIN") {
      throw new ForbiddenError("Forbidden");
    }

    const deleted = await userRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundError("User not found");
    }
  },
};
