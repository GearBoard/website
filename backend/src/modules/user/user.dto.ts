import z from "zod";
import { createUserSchema } from "./user.schema.js";

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  image: string | null;
  description: string | null;
  role: string;
  departmentId: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserRequestDto = z.infer<typeof createUserSchema>;
