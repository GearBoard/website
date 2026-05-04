import type { Request, Response } from "express";
import { successResponse } from "../../common/utils/response.js";
import type { AuthenticatedRequest } from "../../common/types/index.js";
import { handleHttpError } from "../../common/utils/http-error.js";
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
      res.status(200).json(successResponse(post));
    } catch (error) {
      handleHttpError(res, error);
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
      handleHttpError(res, error);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      const post = await postService.create(req.body, authReq.user.id);
      res.status(201).json(successResponse(post));
    } catch (error) {
      handleHttpError(res, error);
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
      res.status(200).json(successResponse(result));
    } catch (error) {
      handleHttpError(res, error);
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

      await postService.delete(id, authReq.user.id);
      res.status(200).json(successResponse({ message: "Post deleted successfully" }));
    } catch (error) {
      handleHttpError(res, error);
    }
  },
};
