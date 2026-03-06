import { Router } from "express";
import { validateBody, validateParams } from "../../common/middleware/validate.middleware.js";
import { commentController } from "./comment.controller.js";
import { GetCommentByPostIDSchema, createCommentSchema } from "./comment.schema.js";

export const commentRoute = Router({ mergeParams: true });

commentRoute.get(
  "/",
  validateParams(GetCommentByPostIDSchema),
  commentController.GetCommentByPostId.bind(commentController)
);

commentRoute.post(
  "/",
  validateBody(createCommentSchema),
  commentController.createComment.bind(commentController)
);

commentRoute.post(
  "/:commentId/replies",
  validateBody(createCommentSchema),
  commentController.createReply.bind(commentController)
);
