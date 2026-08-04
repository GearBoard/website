import { z } from "zod";

export const LikeCommentParamsInputDTO = z.object({
  commentId: z.string().trim().min(1, "Invalid comment id"),
});

export class LikeCommentOutputDTO {
  commentId!: string;
  liked!: boolean;
  likeCount!: number;

  static toDTO(commentId: string, liked: boolean, likeCount: number): LikeCommentOutputDTO {
    return { commentId, liked, likeCount };
  }
}
