import { z } from "zod";

// GET - Param schemas
export const getPostByIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .transform((s) => BigInt(s))
    .refine((n) => n >= 1n, {
      message: "Invalid post id",
    }),
});

// GET /posts - Query schemas
export const getAllPostsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .refine((n) => n >= 1, { message: "Page must be >= 1" }),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .refine((n) => n >= 1 && n <= 100, { message: "Limit must be between 1 and 100" }),
  search: z.string().optional(),
  tag: z.string().optional(),
  userId: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      try {
        const n = BigInt(v);
        if (n < 1n) throw new Error();
        return n;
      } catch {
        throw new Error("userId must be a valid positive bigint");
      }
    }),
});

// POST - Create schema
export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().trim().min(1, "Description is required"),
  tags: z
    .array(z.string().trim())
    .optional()
    .default([])
    .transform((tags) => [...new Set(tags)]), // Remove duplicates
  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
});

// PATCH - Update schema
export const updatePostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title too long").optional(),
  description: z.string().trim().min(1, "Description is required").optional(),
  tags: z
    .array(z.string().trim())
    .optional()
    .transform((tags) => (tags ? [...new Set(tags)] : undefined)),
  isClosed: z.boolean().optional(),
});

export type GetPostByIdParams = z.infer<typeof getPostByIdSchema>;
export type GetAllPostsQuery = z.infer<typeof getAllPostsQuerySchema>;
export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;
