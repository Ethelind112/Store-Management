export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'CASHIER' | string;

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface GetUsersParams {
  page?: number;
  per_page?: number;
  name?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
}

export interface AuthJwtClaims {
  user_id: string;
  username: string;
  role: string;
  exp?: number;
  [key: string]: unknown;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface AuthFormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  general?: string;
}
