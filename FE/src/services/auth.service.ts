import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

const USER_STORAGE_KEY = 'mfg-auth-users';
const CURRENT_USER_KEY = 'mfg-current-user';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  if (digits.startsWith('84')) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith('0')) {
    return digits;
  }

  return digits.length >= 9 ? `0${digits}` : '';
}

function parseIdentifier(value: string): { email?: string; phone?: string } {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error('Vui lòng nhập email hoặc số điện thoại.');
  }

  if (isEmail(trimmedValue)) {
    return { email: trimmedValue.toLowerCase() };
  }

  const normalizedPhone = normalizePhone(trimmedValue);
  if (normalizedPhone) {
    return { phone: normalizedPhone };
  }

  throw new Error('Vui lòng nhập đúng email hoặc số điện thoại hợp lệ.');
}

function loadStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as AuthUser[];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function saveCurrentUser(user: AuthUser): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const users = loadStoredUsers();
  const identifier = parseIdentifier(payload.emailOrPhone);
  const existingUser = users.find((user) => {
    const sameEmail = Boolean(identifier.email && user.email?.toLowerCase() === identifier.email);
    const samePhone = Boolean(identifier.phone && user.phone === identifier.phone);
    return sameEmail || samePhone;
  });

  if (existingUser) {
    throw new Error('Email hoặc số điện thoại này đã được sử dụng.');
  }

  if (payload.password !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp.');
  }

  const newUser: AuthUser = {
    id: `${Date.now()}`,
    username: payload.username.trim(),
    email: identifier.email,
    phone: identifier.phone,
    displayName: payload.displayName.trim() || payload.username.trim(),
    password: payload.password,
  };

  users.push(newUser);
  saveStoredUsers(users);
  saveCurrentUser(newUser);

  return {
    user: newUser,
    message: 'Đăng ký tài khoản thành công.',
  };
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const users = loadStoredUsers();
  const identifier = parseIdentifier(payload.emailOrPhone);
  const matchedUser = users.find((user) => {
    const sameEmail = Boolean(identifier.email && user.email?.toLowerCase() === identifier.email);
    const samePhone = Boolean(identifier.phone && user.phone === identifier.phone);
    return (sameEmail || samePhone) && user.password === payload.password;
  });

  if (!matchedUser) {
    throw new Error('Email/số điện thoại hoặc mật khẩu không đúng.');
  }

  saveCurrentUser(matchedUser);

  return {
    user: matchedUser,
    message: 'Đăng nhập thành công.',
  };
}
