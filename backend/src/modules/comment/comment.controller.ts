import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { commentService } from "./comment.service.js";

export const commentController = {
  async GetCommentByPostId(req: Request, res: Response) {
    const { id } = (req as Request & { validateParams: { id: bigint } }).validateParams;

    const data = await commentService.getById(id);
    if (!data) {
      res.status(404).json(errorResponse("Post not found"));
      return;
    }

    res.status(200).json(successResponse(data));
  },

  async createComment(req: Request, res: Response) {
    try {
      const data = await commentService.createComment(req.body);
      res.status(201).json(successResponse(data));
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "") {
        res.status(400).json(errorResponse("Post doesn't exist"));
        return;
      }
      throw e;
    }
  },

  async createReply(req: Request, res: Response) {},
};
