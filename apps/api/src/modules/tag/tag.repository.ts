import type { Tag } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

export const tagRepository = {
  async findById(id: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  },

  async findAll(): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },
};
