export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
  expiresAt: string;
}
