import z from "zod";
import { getUsersQuerySchema, updateUserSchema } from "./user.schema.js";

export interface UserResponseDto {
  id: string;
  name: string;
  username: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  description: string | null;
  role: string;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>;
export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>;

export interface PaginatedUserResponseDto {
  items: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
