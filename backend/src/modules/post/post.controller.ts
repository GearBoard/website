import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../common/utils/response.js";
import type { AuthenticatedRequest } from "../../common/types/index.js";
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
      const authReq = req as AuthenticatedRequest;
      const post = await postService.create(req.body, authReq.user.id);
      res.status(201).json(successResponse(post));
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },

  async update(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = (
        authReq as AuthenticatedRequest & {
          validatedParams: GetPostByIdParams;
        }
      ).validatedParams;

      const result = await postService.update(id, req.body, authReq.user.id);
      switch (result.status) {
        case "not_found":
          res.status(404).json(errorResponse("Post not found"));
          return;
        case "forbidden":
          res.status(403).json(errorResponse("Forbidden"));
          return;
        case "success":
          res.status(200).json(successResponse(result.data));
          return;
      }
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = (
        authReq as AuthenticatedRequest & {
          validatedParams: GetPostByIdParams;
        }
      ).validatedParams;

      const result = await postService.delete(id, authReq.user.id);
      if (result === null) {
        res.status(404).json(errorResponse("Post not found"));
        return;
      }
      if (!result) {
        res.status(403).json(errorResponse("Forbidden"));
        return;
      }

      res.status(200).json(successResponse({ message: "Post deleted successfully" }));
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json(errorResponse("Internal server error"));
    }
  },
};
