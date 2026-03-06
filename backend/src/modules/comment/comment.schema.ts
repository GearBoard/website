import { z } from "zod";

export const postIdValidateSchema = z.object({
  postId: z
    .string()
    .min(1)
    .transform((s) => BigInt(s))
    .refine((n) => n >= 1n, {
      message: "Invalid post id",
    }),
});

export const commentIdValidateSchema = z.object({
  commentId: z
    .string()
    .min(1)
    .transform((s) => BigInt(s))
    .refine((n) => n >= 1n, {
      message: "Invalid comment id",
    }),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Content of comment is require"),
  images: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export const createReplySchema = z.object({
  content: z.string().min(1, "Content of comment is require"),
  images: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});
