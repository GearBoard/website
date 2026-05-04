import type { User } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { CreateUserRequestDto } from "./user.dto.js";

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  },

  async create(data: CreateUserRequestDto): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.username,
        username: data.username,
        email: data.email,
        role: "USER",
        image: data.image,
        description: data.description,
        departmentId: data.departmentId,
      },
    });

    return user;
  },
};
