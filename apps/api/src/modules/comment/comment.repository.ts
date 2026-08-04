import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";

const commentInclude = {
  images: true,
  user: true,
} satisfies Prisma.CommentInclude;

type CommentWithUser = Prisma.CommentGetPayload<{ include: typeof commentInclude }>;

export interface Comment extends CommentWithUser {
  replies?: Comment[];
}

type CommentData = { content: string; images?: string | null };

function buildCommentTree(flat: CommentWithUser[]): Comment[] {
  const nodeById = new Map<string, Comment>();
  const visibleById = new Map<string, boolean>();
  const roots: Comment[] = [];

  // flat is ordered by createdAt asc, so a parent is always visited before its
  // children - visibleById.get(parentId) is populated by the time we need it.
  for (const comment of flat) {
    const parentVisible = comment.parentId ? (visibleById.get(comment.parentId) ?? false) : true;
    const visible = comment.deletedAt === null && parentVisible;
    visibleById.set(comment.id, visible);
    if (!visible) continue;

    const node: Comment = { ...comment, replies: [] };
    nodeById.set(comment.id, node);

    const parent = comment.parentId ? nodeById.get(comment.parentId) : undefined;
    if (parent) {
      parent.replies!.push(node);
    } else {
      roots.push(node);
    }
  }

  roots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return roots;
}

export const commentRepository = {
  async findById(id: string): Promise<Comment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
      include: commentInclude,
    });

    return comment as Comment | null;
  },

  async findManyByPostId(postId: string): Promise<Comment[]> {
    // Deleted comments are fetched too (and filtered out in buildCommentTree)
    // so a deleted ancestor doesn't sever the link to its still-active descendants.
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: commentInclude,
      orderBy: { createdAt: "asc" },
    });

    return buildCommentTree(comments);
  },

  async create(userId: string, postId: string, data: CommentData): Promise<Comment> {
    const comment = await prisma.comment.create({
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

    return comment as Comment;
  },

  async createReply(
    userId: string,
    postId: string,
    parentId: string,
    data: CommentData
  ): Promise<Comment> {
    const comment = await prisma.comment.create({
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

    return comment as Comment;
  },

  async softDelete(id: string): Promise<void> {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const idsToDelete = [id];
      let frontier = [id];

      while (frontier.length > 0) {
        const children = await tx.comment.findMany({
          where: { parentId: { in: frontier }, deletedAt: null },
          select: { id: true },
        });
        if (children.length === 0) break;

        const childIds = children.map((child) => child.id);
        idsToDelete.push(...childIds);
        frontier = childIds;
      }

      await tx.comment.updateMany({
        where: { id: { in: idsToDelete } },
        data: { deletedAt: new Date() },
      });
    });
  },

  async findLike(userId: string, commentId: string) {
    return prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
  },

  async like(userId: string, commentId: string): Promise<number> {
    const comment = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.commentLike.create({ data: { userId, commentId } });
      return tx.comment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } },
      });
    });

    return comment.likeCount;
  },

  async unlike(userId: string, commentId: string): Promise<number> {
    const comment = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
      });
      return tx.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
      });
    });

    return comment.likeCount;
  },
};
