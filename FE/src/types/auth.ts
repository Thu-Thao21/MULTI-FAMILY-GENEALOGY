export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  displayName: string;
  role?: 'admin' | 'member' | string;
  token?: string;
}

export interface RegisterPayload {
  username: string;
  emailOrPhone: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  role?: 'member' | string;
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
  role?: 'admin' | 'member' | string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}
