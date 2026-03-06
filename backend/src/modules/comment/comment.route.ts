import { Router } from "express";
import { validateBody, validateParams } from "../../common/middleware/validate.middleware.js";
import { commentController } from "./comment.controller.js";
import {
  postIdValidateSchema,
  commentIdValidateSchema,
  createCommentSchema,
  createReplySchema,
} from "./comment.schema.js";

export const commentRoute = Router({ mergeParams: true });

commentRoute.get(
  "/",
  validateParams(postIdValidateSchema),
  commentController.GetCommentByPostId.bind(commentController)
);

commentRoute.post(
  "/",
  validateParams(postIdValidateSchema),
  validateBody(createCommentSchema),
  commentController.createComment.bind(commentController)
);

commentRoute.post(
  "/:commentId/replies",
  validateParams(commentIdValidateSchema),
  validateBody(createReplySchema),
  commentController.createReply.bind(commentController)
);

commentRoute.delete(
  "/:commentId",
  validateParams(commentIdValidateSchema),
  commentController.deleteComment.bind(commentController)
);
