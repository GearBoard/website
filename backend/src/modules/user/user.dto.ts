import type { UserEntity } from "./user.entity.js";

// DTOs
export interface UserResponseDto {
  id: string;
  studentId: string;
  username: string;
  email: string;
  profileURL: string | null;
  description: string | null;
  role: string;
  reputation: number;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequestDto {
  studentId: string;
  username: string;
  email: string;
  profileURL?: string | null;
  description?: string | null;
  role: string;
  departmentId?: string | null;
}

// Helper Function
export function toUserResponseDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id.toString(),
    studentId: user.studentId,
    username: user.username,
    email: user.email,
    profileURL: user.profileURL,
    description: user.description,
    role: user.role,
    reputation: user.reputation,
    departmentId: user.departmentId === null ? null : user.departmentId.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
