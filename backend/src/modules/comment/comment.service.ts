import { commentRepository } from "./comment.repository.js";
import { toDto, type CommentWithRelations } from "./comment.mapper.js";
import type { CreateCommentRequestDto, CreateReplyRequestDto } from "./comment.dto.js";

export const commentService = {
  async getById(id: string) {
    const comment = await commentRepository.getById(id);
    if (!comment) return null;
    return toDto(comment as CommentWithRelations);
  },

  async getByPostId(postId: string) {
    const comments = await commentRepository.getByPostId(postId);
    return comments.map((c) => toDto(c));
  },

  async createComment(userId: string, postId: string, data: CreateCommentRequestDto) {
    const comment = await commentRepository.createComment(userId, postId, data);
    return toDto(comment as CommentWithRelations);
  },

  async createReply(userId: string, postId: string, parentId: string, data: CreateReplyRequestDto) {
    const comment = await commentRepository.createReply(userId, postId, parentId, data);
    return toDto(comment as CommentWithRelations);
  },

  async deleteComment(id: string) {
    await commentRepository.deleteComment(id);
  },
};
