import { z } from "zod";

export const getUserByIdSchema = z.object({
  id: z.string().min(1, "Invalid user id"),
});

const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  role: userRoleSchema.optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    image: z
      .string()
      .url()
      .optional()
      .nullable()
      .or(z.literal(""))
      .transform((v) => (v === undefined ? undefined : v ? v : null)),
    description: z.string().optional().nullable(),
    departmentId: z
      .string()
      .trim()
      .min(1, "Department ID cannot be empty")
      .optional()
      .nullable()
      .or(z.literal(""))
      .transform((v) => (v === undefined ? undefined : v ? v : null)),
  })
  .strict("Cannot update forbidden fields (like role, password, id, or deletedAt)");
