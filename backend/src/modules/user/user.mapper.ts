import { User } from "../../../generated/prisma/client.js";
import type { UserResponseDto } from "./user.dto.js";

export function toDto(user: User): UserResponseDto {
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
