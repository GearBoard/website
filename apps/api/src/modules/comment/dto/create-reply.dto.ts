import { z } from "zod";
import type { Comment } from "../comment.repository.js";
import { GetCommentsByPostIdOutputDTO } from "../../post/dto/get-comments-by-post-id.dto.js";

export const CreateReplyParamsInputDTO = z.object({
  commentId: z.string().trim().min(1, "Invalid comment id"),
});

export const CreateReplyBodyInputDTO = z.object({
  content: z.string().min(1, "Content of comment is required"),
  images: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export type CreateReplyBody = z.infer<typeof CreateReplyBodyInputDTO>;

export class CreateReplyOutputDTO extends GetCommentsByPostIdOutputDTO {
  static toDTO(comment: Comment): CreateReplyOutputDTO {
    return GetCommentsByPostIdOutputDTO.toDTO(comment);
  }
}
