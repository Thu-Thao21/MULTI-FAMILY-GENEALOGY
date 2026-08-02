export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  displayName: string;
  password?: string;
  token?: string;
}

export interface RegisterPayload {
  username: string;
  emailOrPhone: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}
