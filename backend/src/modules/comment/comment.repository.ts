import { prisma } from "../../config/prisma.js";
import type { CreateCommentRequestDto, CreateReplyRequestDto } from "./comment.dto.js";

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
  async getById(id: bigint) {
    return prisma.comment.findUnique({
      where: { id },
      include: commentInclude,
    });
  },

  async getByPostId(postId: bigint) {
    return prisma.comment.findMany({
      where: { postId, parentId: null },
      include: commentInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async createComment(userId: bigint, postId: bigint, data: CreateCommentRequestDto) {
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

  async createReply(userId: bigint, postId: bigint, parentId: bigint, data: CreateReplyRequestDto) {
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

  async deleteComment(id: bigint) {
    return prisma.$transaction([
      prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } }),
      prisma.comment.updateMany({ where: { parentId: id }, data: { deletedAt: new Date() } }),
    ]);
  },
};
