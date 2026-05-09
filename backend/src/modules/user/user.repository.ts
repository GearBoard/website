import { Prisma } from "../../../generated/prisma/client.js";
import type { User } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import type { UpdateUserRequestDto } from "./user.dto.js";

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    return user;
  },

  async findMany(options: {
    skip: number;
    take: number;
    search?: string;
    role?: "USER" | "ADMIN";
    departmentId?: string;
  }): Promise<{ users: User[]; total: number }> {
    const { skip, take, search, role, departmentId } = options;

    const whereConditions: Prisma.UserWhereInput = { deletedAt: null };

    if (search) {
      whereConditions.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      whereConditions.role = role;
    }

    if (departmentId) {
      whereConditions.departmentId = departmentId;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: whereConditions }),
    ]);

    return { users, total };
  },

  async update(id: string, data: UpdateUserRequestDto): Promise<User | null> {
    const updateData: Prisma.UserUpdateInput = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.departmentId !== undefined) {
      updateData.department =
        data.departmentId !== null ? { connect: { id: data.departmentId } } : { disconnect: true };
    }

    try {
      return await prisma.user.update({
        where: { id, deletedAt: null },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }
      throw error;
    }
  },

  async softDelete(id: string): Promise<{ id: string } | null> {
    try {
      const user = await prisma.user.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
        select: { id: true },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }
      throw error;
    }
  },
};
