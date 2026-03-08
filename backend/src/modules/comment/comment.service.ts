import { commentRepository } from "./comment.repository.js";
import { toDto, type CommentWithRelations } from "./comment.mapper.js";
import type { CreateCommentRequestDto, CreateReplyRequestDto } from "./comment.dto.js";

export const commentService = {
  async getById(id: bigint) {
    const comment = await commentRepository.getById(id);
    if (!comment) return null;
    return toDto(comment as CommentWithRelations);
  },

  async getByPostId(postId: bigint) {
    const comments = await commentRepository.getByPostId(postId);
    return comments.map((c: unknown) => toDto(c as CommentWithRelations));
  },

  async createComment(userId: bigint, postId: bigint, data: CreateCommentRequestDto) {
    const comment = await commentRepository.createComment(userId, postId, data);
    return toDto(comment as CommentWithRelations);
  },

  async createReply(userId: bigint, postId: bigint, parentId: bigint, data: CreateReplyRequestDto) {
    const comment = await commentRepository.createReply(userId, postId, parentId, data);
    return toDto(comment as CommentWithRelations);
  },

  async deleteComment(id: bigint) {
    await commentRepository.deleteComment(id);
  },
};
