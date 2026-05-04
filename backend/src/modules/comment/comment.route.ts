import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth.middleware.js";
import { validateBody, validateParams } from "../../common/middleware/validate.middleware.js";
import { commentController } from "./comment.controller.js";
import { commentIdValidateSchema, createReplySchema } from "./comment.schema.js";

export const commentRoute = Router({ mergeParams: true });

commentRoute.post(
  "/:commentId/replies",
  requireAuth,
  validateParams(commentIdValidateSchema),
  validateBody(createReplySchema),
  commentController.createReply.bind(commentController)
);

commentRoute.delete(
  "/:commentId",
  requireAuth,
  validateParams(commentIdValidateSchema),
  commentController.deleteComment.bind(commentController)
);
