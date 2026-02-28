export interface UserEntity {
  id: bigint;
  studentId: string;
  username: string;
  email: string;
  profileURL: string | null;
  description: string | null;
  role: string;
  reputation: number;
  departmentId: bigint | null;
  createdAt: Date;
  updatedAt: Date;
}
