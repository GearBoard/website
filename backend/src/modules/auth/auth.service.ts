import type { LoginDto, RegisterDto } from "./auth.dto.js";

export const authService = {
  async login(_data: LoginDto) {
    // TODO: validate user, return token
    return { token: "", user: { id: "", email: "", username: "" } };
  },
  async register(_data: RegisterDto) {
    // TODO: create user, return token
    return { token: "", user: { id: "", email: "", username: "" } };
  },
};
