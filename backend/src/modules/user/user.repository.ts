import type { Prisma, User } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { GetUsersQueryDto, UpdateUserRequestDto } from "./user.dto.js";

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    return user;
  },

  async findMany(query: GetUsersQueryDto): Promise<{ items: User[]; total: number }> {
    const { page, limit, search, role } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  async update(id: string, data: UpdateUserRequestDto): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return user;
  },

  async softDelete(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return user;
  },
};
