import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../common/types/index.js";
import { successResponse } from "../../common/utils/response.js";
import { handleHttpError } from "../../common/utils/http-error.js";
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
      const data = await commentService.createReplyFromParent(commentId, authReq.user.id, req.body);
      res.status(201).json(successResponse(data));
    } catch (error) {
      handleHttpError(res, error);
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
      await commentService.deleteComment(commentId);
      res.status(200).json(successResponse({ message: "Comment deleted successfully" }));
    } catch (error) {
      handleHttpError(res, error);
    }
  },
};
