import type { User } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { CreateUserRequestDto } from "./user.dto.js";

export const userRepository = {
  async findById(id: bigint): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  },

  async create(data: CreateUserRequestDto): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  },
};
