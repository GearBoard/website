import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../common/types/index.js";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { commentService } from "./comment.service.js";

export const commentController = {
  async createReply(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    const { commentId } = (
      authReq as AuthenticatedRequest & {
        validatedParams: { commentId: string };
      }
    ).validatedParams;

    try {
      // For createReply, we need the postId which is likely attached to the parent comment.
      // We should first fetch the parent comment to get the postId.
      const parentComment = await commentService.getById(commentId);
      if (!parentComment) {
        res.status(404).json(errorResponse("Comment doesn't exist"));
        return;
      }

      const data = await commentService.createReply(
        authReq.user.id,
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
    const authReq = req as AuthenticatedRequest;
    const { commentId } = (
      authReq as AuthenticatedRequest & {
        validatedParams: { commentId: string };
      }
    ).validatedParams;

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
