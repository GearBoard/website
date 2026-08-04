import { Prisma, type Tag } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

const postInclude = {
  user: {
    select: {
      id: true,
      name: true,
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

export type Post = Prisma.PostGetPayload<{ include: typeof postInclude }>;

type CreatePostData = {
  title: string;
  description: string;
  tags: Tag[];
  images: string[];
};

type UpdatePostData = {
  title?: string;
  description?: string;
  tags?: string[];
  isClosed?: boolean;
};

export const postRepository = {
  async findById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
      include: postInclude,
    });
    return post as Post | null;
  },

  async findMany(options: {
    skip: number;
    take: number;
    search?: string;
    tagName?: string;
    userId?: string;
  }): Promise<{ posts: Post[]; total: number }> {
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
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
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
      posts: posts as Post[],
      total,
    };
  },

  async create(data: CreatePostData, userId: string): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        tags: {
          create: data.tags.map((tag) => ({
            tag: {
              connect: { id: tag.id },
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

    return post as Post;
  },

  async update(id: string, data: UpdatePostData): Promise<Post> {
    const updateData: Prisma.PostUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isClosed !== undefined) updateData.isClosed = data.isClosed;

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (data.tags !== undefined) {
        await tx.postTag.deleteMany({ where: { postId: id } });

        if (data.tags.length > 0) {
          await Promise.all(
            data.tags.map((tagName) =>
              tx.postTag.create({
                data: {
                  post: { connect: { id } },
                  tag: {
                    connectOrCreate: {
                      where: { name: tagName },
                      create: {
                        name: tagName,
                        color: "#C01300",
                        backgroundColor: "#C0130020",
                      },
                    },
                  },
                },
              })
            )
          );
        }
      }

      return tx.post.update({
        where: { id, deletedAt: null },
        data: updateData,
        include: postInclude,
      }) as Promise<Post>;
    });
  },

  async softDelete(id: string): Promise<void> {
    await prisma.post.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
