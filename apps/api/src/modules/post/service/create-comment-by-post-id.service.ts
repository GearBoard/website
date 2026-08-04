import { NotFoundError } from "../../../common/errors/app-error.js";
import { commentRepository } from "../../comment/comment.repository.js";
import { postRepository } from "../post.repository.js";
import {
  CreateCommentByPostIdOutputDTO,
  type CreateCommentBody,
} from "../dto/create-comment-by-post-id.dto.js";

export async function createCommentByPostIdService(
  userId: string,
  postId: string,
  data: CreateCommentBody
): Promise<CreateCommentByPostIdOutputDTO> {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError("Post not found");

  const comment = await commentRepository.create(userId, postId, data);

  return CreateCommentByPostIdOutputDTO.toDTO(comment);
}
