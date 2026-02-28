export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponseDto {
  token: string;
  user: { id: string; email: string; username: string };
}
