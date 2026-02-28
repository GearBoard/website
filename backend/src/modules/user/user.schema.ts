import { z } from "zod";

export const getUserByIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .transform((s) => BigInt(s))
    .refine((n) => n >= 1n, {
      message: "Invalid user id",
    }),
});

const authProviderSchema = z.enum(["LOCAL", "GOOGLE"]);
const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  email: z.string().email("Invalid email").trim(),
  password: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v ?? null),
  role: userRoleSchema.optional().default("USER"),
  image: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  description: z.string().optional().nullable().default(null),
  departmentId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null || v === "") {
        return null;
      }
      try {
        const n = BigInt(v);
        if (n < 1n) throw new Error();
        return n;
      } catch {
        throw new Error("departmentId must be a valid positive bigint");
      }
    }),
  provider: authProviderSchema.optional().default("LOCAL"),
});
