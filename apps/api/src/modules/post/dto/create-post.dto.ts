import { z } from "zod";
import { GetPostByIdOutputDTO } from "./get-post-by-id.dto.js";
import type { Post } from "../post.repository.js";

export const CreatePostBodyInputDTO = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().trim().min(1, "Description is required"),
  tagIds: z
    .array(z.string().trim().min(1, "Invalid tag id"))
    .max(3, "A post can have at most 3 tags")
    .optional()
    .default([])
    .transform((tagIds) => [...new Set(tagIds)]),
  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
});

export type CreatePostBody = z.infer<typeof CreatePostBodyInputDTO>;

export class CreatePostOutputDTO extends GetPostByIdOutputDTO {
  static toDTO(post: Post): CreatePostOutputDTO {
    return GetPostByIdOutputDTO.toDTO(post);
  }
}
