import { z } from "zod";

export const UnlikeCommentParamsInputDTO = z.object({
  commentId: z.string().trim().min(1, "Invalid comment id"),
});

export class UnlikeCommentOutputDTO {
  commentId!: string;
  liked!: boolean;
  likeCount!: number;

  static toDTO(commentId: string, liked: boolean, likeCount: number): UnlikeCommentOutputDTO {
    return { commentId, liked, likeCount };
  }
}
