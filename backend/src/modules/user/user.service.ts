import { prisma } from "../../config/prisma.js";
import type { CreateUserRequestDto } from "./user.dto.js";
import type { UserEntity } from "./user.entity.js";

export const userService = {
  async getById(id: bigint): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user as UserEntity | null;
  },

  async create(dto: CreateUserRequestDto): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        studentId: dto.studentId,
        username: dto.username,
        email: dto.email,
        profileURL: dto.profileURL ?? null,
        description: dto.description ?? null,
        role: dto.role,
        departmentId: dto.departmentId ? BigInt(dto.departmentId) : null,
      },
    });

    return user as UserEntity;
  },
};
