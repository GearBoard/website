import { z } from "zod";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import { PaginatedResult } from "../../common/utils/pagination.js";

export interface AuthorInfoDto {
  id: string;
  username: string;
  image: string | null;
}

export interface PostResponseDto {
  id: string;
  title: string;
  description: string;
  tags: string[]; // tag names
  images: string[]; // image URLs
  likeCount: number;
  commentCount: number;
  isClosed: boolean;
  authorInfo: AuthorInfoDto;
  createdAt: string;
  updatedAt: string;
}

export interface PostPaginatedDto {
  data: PostResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CreatePostRequestDto = z.infer<typeof createPostSchema>;
export type UpdatePostRequestDto = z.infer<typeof updatePostSchema>;
