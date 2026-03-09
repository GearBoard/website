import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import { postService } from "./post.service.js";
import { GetPostByIdParams, GetAllPostsQuery } from "./post.schema.js";

export const postController = {
  async getById(req: Request, res: Response) {
    try {
      const { id } = (
        req as Request & {
          validatedParams: GetPostByIdParams;
        }
      ).validatedParams;

      const post = await postService.getById(id);

      if (!post) {
        res.status(404).json(errorResponse("Post not found"));
        return;
      }

      res.status(200).json(successResponse(post));
    } catch (error) {
      console.error("Error in getById:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const query = (
        req as Request & {
          validatedQuery: GetAllPostsQuery;
        }
      ).validatedQuery;

      const result = await postService.getAll(query);
      res.status(200).json(successResponse(result));
    } catch (error) {
      console.error("Error in getAll:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },

  async create(req: Request, res: Response) {
    try {
      // Get userId from session/auth context
      // For now, we'll mock it - in production, this should come from Better Auth
      const userId = req.headers["x-user-id"];

      if (!userId) {
        res.status(401).json(errorResponse("Unauthorized: User not authenticated"));
        return;
      }

      const userIdBigInt = BigInt(userId as string);
      const data = req.body;

      const post = await postService.create(data, userIdBigInt);
      res.status(201).json(successResponse(post));
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = (
        req as Request & {
          validatedParams: GetPostByIdParams;
        }
      ).validatedParams;

      const userId = req.headers["x-user-id"];

      if (!userId) {
        res.status(401).json(errorResponse("Unauthorized: User not authenticated"));
        return;
      }

      const userIdBigInt = BigInt(userId as string);
      const data = req.body;

      // Check if post exists first
      const existingPost = await postService.getById(id);
      if (!existingPost) {
        res.status(404).json(errorResponse("Post not found"));
        return;
      }

      const updatedPost = await postService.update(id, data, userIdBigInt);

      if (!updatedPost) {
        res.status(403).json(errorResponse("Forbidden: Only post owner or admin can update"));
        return;
      }

      res.status(200).json(successResponse(updatedPost));
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = (
        req as Request & {
          validatedParams: GetPostByIdParams;
        }
      ).validatedParams;

      const userId = req.headers["x-user-id"];

      if (!userId) {
        res.status(401).json(errorResponse("Unauthorized: User not authenticated"));
        return;
      }

      const userIdBigInt = BigInt(userId as string);

      // Check if post exists first
      const existingPost = await postService.getById(id);
      if (!existingPost) {
        res.status(404).json(errorResponse("Post not found"));
        return;
      }

      const deleted = await postService.delete(id, userIdBigInt);

      if (!deleted) {
        res.status(403).json(errorResponse("Forbidden: Only post owner or admin can delete"));
        return;
      }

      res.status(200).json(successResponse({ message: "Post deleted successfully" }));
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },
};
