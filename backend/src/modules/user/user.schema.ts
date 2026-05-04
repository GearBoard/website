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
