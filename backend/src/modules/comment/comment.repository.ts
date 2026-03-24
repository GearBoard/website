import { prisma } from "../../config/prisma.js";
import type { CreateCommentRequestDto, CreateReplyRequestDto } from "./comment.dto.js";
import type { CommentWithRelations } from "./comment.mapper.js";

const commentInclude = {
  images: true,
  user: true,
  replies: {
    include: {
      images: true,
      user: true,
    },
  },
};

export const commentRepository = {
  async getById(id: string) {
    return prisma.comment.findFirst({
      where: { id, deletedAt: null },
      include: commentInclude,
    });
  },

  async getByPostId(postId: string): Promise<CommentWithRelations[]> {
    return prisma.comment.findMany({
      where: { postId, parentId: null, deletedAt: null },
      include: commentInclude,
      orderBy: { createdAt: "desc" },
    }) as unknown as Promise<CommentWithRelations[]>;
  },

  async createComment(userId: string, postId: string, data: CreateCommentRequestDto) {
    return prisma.comment.create({
      data: {
        userId,
        postId,
        content: data.content,
        images: data.images
          ? {
              create: { url: data.images },
            }
          : undefined,
      },
      include: commentInclude,
    });
  },

  async createReply(userId: string, postId: string, parentId: string, data: CreateReplyRequestDto) {
    return prisma.comment.create({
      data: {
        userId,
        postId,
        parentId,
        content: data.content,
        images: data.images
          ? {
              create: { url: data.images },
            }
          : undefined,
      },
      include: commentInclude,
    });
  },

  async deleteComment(id: string) {
    return prisma.$transaction([
      prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } }),
      prisma.comment.updateMany({ where: { parentId: id }, data: { deletedAt: new Date() } }),
    ]);
  },
};
