import { z } from "zod";

export const getUserByIdSchema = z.object({
  id: z.string().trim().min(1, { message: "Invalid user id" }),
});

export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  email: z.string().email("Invalid email").trim(),
  image: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  description: z.string().optional().nullable().default(null),
  departmentId: z
    .string()
    .trim()
    .optional()
    .transform((v) => {
      if (v === undefined || v === null || v === "") {
        return null;
      }
      return v;
    }),
});

export const getAllUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .refine((v) => v === undefined || /^[1-9]\d*$/.test(v), {
      message: "Page must be a positive integer",
    })
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .refine((n) => n >= 1, { message: "Page must be >= 1" }),
  limit: z
    .string()
    .optional()
    .refine((v) => v === undefined || /^[1-9]\d*$/.test(v), {
      message: "Limit must be a positive integer",
    })
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .refine((n) => n >= 1 && n <= 100, { message: "Limit must be between 1 and 100" }),
  search: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  departmentId: z.string().trim().min(1).optional(),
});

export const updateUserSchema = z.object({
  username: z.string().trim().min(1, "Username must not be empty").optional(),
  name: z.string().trim().min(1, "Name must not be empty").optional(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v !== undefined ? (v === "" ? null : v) : undefined)),
  description: z.string().optional().nullable(),
  departmentId: z.union([z.string().trim().min(1), z.null()]).optional(),
});

export type GetUserByIdParams = z.infer<typeof getUserByIdSchema>;
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
