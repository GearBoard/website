import { z } from "zod";
import { createCommentSchema, createReplySchema } from "./comment.schema.js";

export type CreateCommentRequestDto = z.infer<typeof createCommentSchema>;
export type CreateReplyRequestDto = z.infer<typeof createReplySchema>;

export interface CommentImageDto {
  id: string;
  url: string;
}

export interface CommentAuthorDto {
  id: string;
  username: string | null;
  image: string | null;
}

export interface CommentResponseDto {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  images: CommentImageDto[];
  author?: CommentAuthorDto;
  replies?: CommentResponseDto[];
  createdAt: string;
}
