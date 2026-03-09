import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { CreatePostRequestDto, UpdatePostRequestDto } from "./post.dto.js";

interface PostWithRelations {
  id: bigint;
  userId: bigint;
  title: string;
  description: string;
  isClosed: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: {
    id: bigint;
    username: string;
    image: string | null;
  };
  tags: Array<{
    postId: bigint;
    tagId: bigint;
    tag: {
      id: bigint;
      name: string;
    };
  }>;
  images: Array<{
    id: bigint;
    postId: bigint;
    url: string;
  }>;
}

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
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
    });

    if (!post) {
      return null;
    }

    // Handle tags update
    if (data.tags !== undefined) {
      // Delete existing tags
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });

      // Create new tags
      if (data.tags.length > 0) {
        await prisma.postTag.createMany({
          data: await Promise.all(
            data.tags.map(async (tagName) => {
              const tag = await prisma.tag.findUnique({ where: { name: tagName } });
              return {
                postId: id,
                tagId: tag ? tag.id : (await prisma.tag.create({ data: { name: tagName } })).id,
              };
            })
          ),
        });
      }
    }

    // Update post fields
    const updateData: Prisma.PostUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isClosed !== undefined) updateData.isClosed = data.isClosed;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: postInclude,
    });

    return updatedPost as PostWithRelations;
  },

  async delete(id: bigint): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async hardDelete(id: bigint): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  },

  async checkOwnership(postId: bigint, userId: bigint): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    return post?.userId === userId;
  },

  async checkIsAdmin(userId: bigint): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === "ADMIN";
  },
};
