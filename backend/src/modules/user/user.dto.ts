import z from "zod";
import { getAllUsersQuerySchema, updateUserSchema } from "./user.schema.js";
import type { PaginatedResult } from "../../common/utils/pagination.js";
import { UserRole } from "../../common/types/index.js";

export interface UserResponseDto {
  id: string;
  username: string | null;
  email: string;
  image: string | null;
  description: string | null;
  role: UserRole;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserPaginatedDto = PaginatedResult<UserResponseDto>;

export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>;
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;
