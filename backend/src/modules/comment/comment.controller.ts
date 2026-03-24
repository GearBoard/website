import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { commentService } from "./comment.service.js";

export const commentController = {
  async createReply(req: Request, res: Response) {
    const { commentId } = (req as Request & { validatedParams: { commentId: string } })
      .validatedParams;

    const user = (req as Request & { user?: { id: string } }).user;
    if (!user || !user.id) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }
    const userId = user.id;

    try {
      // For createReply, we need the postId which is likely attached to the parent comment.
      // We should first fetch the parent comment to get the postId.
      const parentComment = await commentService.getById(commentId);
      if (!parentComment) {
        res.status(404).json(errorResponse("Comment doesn't exist"));
        return;
      }

      const data = await commentService.createReply(
        userId,
        parentComment.postId,
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
    const { commentId } = (req as Request & { validatedParams: { commentId: string } })
      .validatedParams;

    const user = (req as Request & { user?: { id: string; role: string } }).user;
    if (!user || !user.id) {
      res.status(401).json(errorResponse("Unauthorized"));
      return;
    }

    try {
      const parentComment = await commentService.getById(commentId);
      if (!parentComment) {
        res.status(404).json(errorResponse("Comment not found"));
        return;
      }

      if (parentComment.userId !== user.id && user.role !== "ADMIN") {
        res.status(403).json(errorResponse("Forbidden"));
        return;
      }

      await commentService.deleteComment(commentId);
      res.status(200).json(successResponse({ id: commentId, deleted: true }));
    } catch {
      res.status(500).json(errorResponse("Failed to delete comment"));
    }
  },
};
