import { Comment, CommentImage, User } from "../../../generated/prisma/client.js";
import type { CommentResponseDto, CommentImageDto, CommentAuthorDto } from "./comment.dto.js";

export type CommentWithRelations = Comment & {
  images?: CommentImage[];
  user?: User;
  replies?: CommentWithRelations[];
};

export function toDto(comment: CommentWithRelations): CommentResponseDto {
  return {
    id: comment.id.toString(),
    postId: comment.postId.toString(),
    userId: comment.userId.toString(),
    parentId: comment.parentId ? comment.parentId.toString() : null,
    content: comment.content,
    images: comment.images?.map(toImageDto) ?? [],
    author: comment.user ? toAuthorDto(comment.user) : undefined,
    replies: comment.replies?.map(toDto),
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
}

export function toImageDto(image: CommentImage): CommentImageDto {
  return {
    id: image.id.toString(),
    url: image.url,
  };
}

export function toAuthorDto(user: User): CommentAuthorDto {
  return {
    id: user.id.toString(),
    username: user.username,
    image: user.image,
  };
}
