import { z } from "zod";

export const commentIdValidateSchema = z.object({
  commentId: z.string().min(1, "Invalid comment id"),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Content of comment is required"),
  images: z
    .string()
    .url()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export const createReplySchema = createCommentSchema;
