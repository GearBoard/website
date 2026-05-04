import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";
import { requireAuth } from "../../common/middleware/auth.middleware.js";
import { postController } from "./post.controller.js";
import {
  createPostSchema,
  getPostByIdSchema,
  getAllPostsQuerySchema,
  updatePostSchema,
} from "./post.schema.js";

export const postRoute = Router();

// GET /posts/:id - Get post by ID
postRoute.get(
  "/:id",
  validateParams(getPostByIdSchema),
  postController.getById.bind(postController)
);

// GET /posts - Get all posts with pagination and filters
postRoute.get(
  "/",
  validateQuery(getAllPostsQuerySchema),
  postController.getAll.bind(postController)
);

// POST /posts - Create a new post
postRoute.post(
  "/",
  requireAuth,
  validateBody(createPostSchema),
  postController.create.bind(postController)
);

// PATCH /posts/:id - Update a post
postRoute.patch(
  "/:id",
  requireAuth,
  validateParams(getPostByIdSchema),
  validateBody(updatePostSchema),
  postController.update.bind(postController)
);

// DELETE /posts/:id - Delete a post
postRoute.delete(
  "/:id",
  requireAuth,
  validateParams(getPostByIdSchema),
  postController.delete.bind(postController)
);
