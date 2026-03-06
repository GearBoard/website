import { z } from "zod";

export const GetCommentByPostIDSchema = z.object({
  id: z
    .string()
    .min(1)
    .transform((s) => BigInt(s))
    .refine((n) => n >= 1n, {
      message: "Invalid user id",
    }),
});

export const createCommentSchema = z.object({
  id: z
    .string()
    .min(1)
    .transform((s) => BigInt(s))
    .refine((n) => n >= 1n, {
      message: "Invalid user id",
    }),

  content: z.string().min(1, "Content of comment is require"),
  images: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});
