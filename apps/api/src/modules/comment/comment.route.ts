import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { AppVariables } from "../../common/types/index.js";
import { requireAuth } from "../../common/middleware/auth.middleware.js";
import { successResponse } from "../../common/utils/response.js";
import { validationHook } from "../../common/utils/validation-hook.js";
import {
  CreateReplyParamsInputDTO,
  CreateReplyBodyInputDTO,
  DeleteCommentParamsInputDTO,
  LikeCommentParamsInputDTO,
  UnlikeCommentParamsInputDTO,
} from "./dto/index.js";
import {
  createReplyService,
  deleteCommentService,
  likeCommentService,
  unlikeCommentService,
} from "./service/index.js";

export const commentRoute = new Hono<{ Variables: AppVariables }>()
  .post(
    "/:commentId/replies",
    requireAuth,
    zValidator("param", CreateReplyParamsInputDTO, validationHook),
    zValidator("json", CreateReplyBodyInputDTO, validationHook),
    async (c) => {
      const user = c.get("user");
      const { commentId } = c.req.valid("param");
      const data = c.req.valid("json");
      const result = await createReplyService(commentId, user.id, data);
      return c.json(successResponse(result, "Reply created"), 201);
    }
  )
  .delete(
    "/:commentId",
    requireAuth,
    zValidator("param", DeleteCommentParamsInputDTO, validationHook),
    async (c) => {
      const user = c.get("user");
      const { commentId } = c.req.valid("param");
      await deleteCommentService(commentId, user.id);
      return c.json(successResponse(null, "Comment deleted successfully"), 200);
    }
  )
  .post(
    "/:commentId/like",
    requireAuth,
    zValidator("param", LikeCommentParamsInputDTO, validationHook),
    async (c) => {
      const user = c.get("user");
      const { commentId } = c.req.valid("param");
      const result = await likeCommentService(commentId, user.id);
      return c.json(successResponse(result, "Comment liked"), 201);
    }
  )
  .delete(
    "/:commentId/like",
    requireAuth,
    zValidator("param", UnlikeCommentParamsInputDTO, validationHook),
    async (c) => {
      const user = c.get("user");
      const { commentId } = c.req.valid("param");
      const result = await unlikeCommentService(commentId, user.id);
      return c.json(successResponse(result, "Comment unliked"), 200);
    }
  );
