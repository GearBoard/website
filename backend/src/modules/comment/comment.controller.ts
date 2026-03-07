import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { commentService } from "./comment.service.js";

export const commentController = {
  async GetCommentByPostId(req: Request, res: Response) {
    const { postId } = (req as Request & { validatedParams: { postId: bigint } }).validatedParams;

    const data = await commentService.getByPostId(postId);

    res.status(200).json(successResponse(data));
  },

  async createComment(req: Request, res: Response) {
    const { postId } = (req as Request & { validatedParams: { postId: bigint } }).validatedParams;

    // TODO: Update this when proper authentication middleware is available
    // For now, assuming default user ID `1n`
    const userId = (req as Request & { user?: { id: bigint } }).user?.id || 1n;

    try {
      const data = await commentService.createComment(userId, postId, req.body);
      res.status(201).json(successResponse(data));
    } catch (e: unknown) {
      const err = e as { code?: string };
      // P2003 is Prisma's foreign key constraint failed error
      if (err.code === "P2003") {
        res.status(400).json(errorResponse("Post or User doesn't exist"));
        return;
      }
      throw e;
    }
  },

  async createReply(req: Request, res: Response) {
    const { commentId } = (req as Request & { validatedParams: { commentId: bigint } })
      .validatedParams;

    // TODO: Update this when proper authentication middleware is available
    const userId = (req as Request & { user?: { id: bigint } }).user?.id || 1n;

    try {
      // For createReply, we need the postId which is likely attached to the parent comment.
      // We should first fetch the parent comment to get the postId.
      const parentComment = await commentService.getById(commentId);
      if (!parentComment) {
        res.status(404).json(errorResponse("Parent comment doesn't exist"));
        return;
      }

      const data = await commentService.createReply(
        userId,
        BigInt(parentComment.postId),
        commentId,
        req.body
      );
      res.status(201).json(successResponse(data));
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "P2003") {
        res.status(400).json(errorResponse("Parent comment or User doesn't exist"));
        return;
      }
      throw e;
    }
  },

  async deleteComment(req: Request, res: Response) {
    const { commentId } = (req as Request & { validatedParams: { commentId: bigint } })
      .validatedParams;

    try {
      const parentComment = await commentService.getById(commentId);
      if (!parentComment) {
        res.status(404).json(errorResponse("Comment not found"));
        return;
      }

      const data = await commentService.deleteComment(commentId);
      res.status(200).json(successResponse(data));
    } catch {
      res.status(500).json(errorResponse("Failed to delete comment"));
    }
  },
};
