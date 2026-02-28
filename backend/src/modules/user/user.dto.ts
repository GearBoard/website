import z from "zod";
import { createUserSchema } from "./user.schema.js";

export interface UserResponseDto {
  id: string;
  studentId: string;
  username: string;
  email: string;
  profileURL: string | null;
  description: string | null;
  role: string;
  reputation: number;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}
export type CreateUserRequestDto = z.infer<typeof createUserSchema>;
