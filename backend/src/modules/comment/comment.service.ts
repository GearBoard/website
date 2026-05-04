import { NotFoundError } from "../../common/errors/app-error.js";
import { commentRepository } from "./comment.repository.js";
import { toDto, type CommentWithRelations } from "./comment.mapper.js";
import type {
  CommentResponseDto,
  CreateCommentRequestDto,
  CreateReplyRequestDto,
} from "./comment.dto.js";

export const commentService = {
  async getById(id: string): Promise<CommentResponseDto> {
    const comment = await commentRepository.getById(id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    return toDto(comment as CommentWithRelations);
  },

  async getByPostId(postId: string) {
    const comments = await commentRepository.getByPostId(postId);
    return comments.map((c: unknown) => toDto(c as CommentWithRelations));
  },

  async createComment(userId: string, postId: string, data: CreateCommentRequestDto) {
    const comment = await commentRepository.createComment(userId, postId, data);
    return toDto(comment as CommentWithRelations);
  },

  async createReply(userId: string, postId: string, parentId: string, data: CreateReplyRequestDto) {
    const comment = await commentRepository.createReply(userId, postId, parentId, data);
    return toDto(comment as CommentWithRelations);
  },

  async createReplyFromParent(
    parentId: string,
    userId: string,
    data: CreateReplyRequestDto
  ): Promise<CommentResponseDto> {
    const parentComment = await commentRepository.getById(parentId);
    if (!parentComment) {
      throw new NotFoundError("Comment doesn't exist");
    }

    const comment = await commentRepository.createReply(
      userId,
      parentComment.postId,
      parentId,
      data
    );
    return toDto(comment as CommentWithRelations);
  },

  async deleteComment(id: string): Promise<void> {
    const comment = await commentRepository.getById(id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    await commentRepository.deleteComment(id);
  },
};
