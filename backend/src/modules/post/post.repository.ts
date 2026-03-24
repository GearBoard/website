import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { CreatePostRequestDto, UpdatePostRequestDto } from "./post.dto.js";
import { PostWithRelations } from "./post.mapper.js";

const postInclude = {
  user: {
    select: {
      id: true,
      username: true,
      image: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  images: true,
};

export { postInclude };

export const postRepository = {
  async findById(id: bigint): Promise<PostWithRelations | null> {
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
      include: postInclude,
    });
    return post as PostWithRelations | null;
  },

  async findMany(options: {
    skip: number;
    take: number;
    search?: string;
    tagName?: string;
    userId?: bigint;
  }) {
    const { skip, take, search, tagName, userId } = options;

    const whereConditions: Prisma.PostWhereInput = { deletedAt: null };

    if (search) {
      whereConditions.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (tagName) {
      whereConditions.tags = {
        some: {
          tag: {
            name: {
              contains: tagName,
              mode: "insensitive",
            },
          },
        },
      };
    }

    if (userId) {
      whereConditions.userId = userId;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: postInclude,
      }),
      prisma.post.count({
        where: whereConditions,
      }),
    ]);

    return {
      posts: posts as PostWithRelations[],
      total,
    };
  },

  async create(data: CreatePostRequestDto, userId: bigint): Promise<PostWithRelations> {
    const post = await prisma.post.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        tags: {
          create: data.tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
        images: {
          create: data.images.map((url) => ({
            url,
          })),
        },
      },
      include: postInclude,
    });

    return post as PostWithRelations;
  },

  async update(id: bigint, data: UpdatePostRequestDto): Promise<PostWithRelations | null> {
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id, deletedAt: null },
      });

      if (!post) {
        return null;
      }

      // Handle tags update
      if (data.tags !== undefined) {
        // Delete existing tags
        await tx.postTag.deleteMany({
          where: { postId: id },
        });

        // Create new tags
        if (data.tags.length > 0) {
          await Promise.all(
            data.tags.map(async (tagName) => {
              await tx.postTag.create({
                data: {
                  postId: id,
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName },
                      create: { name: tagName },
                    },
                  },
                },
              });
            })
          );
        }
      }

      // Update post fields
      const updateData: Prisma.PostUpdateInput = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isClosed !== undefined) updateData.isClosed = data.isClosed;

      const updatedPost = await tx.post.update({
        where: { id },
        data: updateData,
        include: postInclude,
      });

      return updatedPost as PostWithRelations;
    });
  },

  async delete(id: bigint): Promise<void | null> {
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id, deletedAt: null },
        select: { id: true },
      });

      if (!post) {
        return null;
      }

      await tx.post.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return null;
    });
  },
};
