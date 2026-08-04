import { ConflictError, NotFoundError } from "../../../common/errors/app-error.js";
import { commentRepository } from "../comment.repository.js";
import { LikeCommentOutputDTO } from "../dto/like-comment.dto.js";

export async function likeCommentService(
  commentId: string,
  userId: string
): Promise<LikeCommentOutputDTO> {
  const comment = await commentRepository.findById(commentId);
  if (!comment) throw new NotFoundError("Comment not found");

  const existingLike = await commentRepository.findLike(userId, commentId);
  if (existingLike) throw new ConflictError("Comment already liked");

  const likeCount = await commentRepository.like(userId, commentId);
  return LikeCommentOutputDTO.toDTO(commentId, true, likeCount);
}
