import apiClient from '../api/axios';
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

const USER_STORAGE_KEY = 'mfg-auth-users';
const CURRENT_USER_KEY = 'mfg-current-user';
const OTP_STORAGE_KEY = 'mfg-otp-sessions';

export const DEFAULT_DEMO_USERS: AuthUser[] = [
  {
    id: 'user_admin_001',
    username: 'admin',
    email: 'nguyenvanan.admin@gmail.com',
    phone: '0912345678',
    displayName: 'Nguyễn Văn An',
    password: '123456',
  },
  {
    id: 'user_002',
    username: 'thao_truongho',
    email: 'tranthithao.head@gmail.com',
    phone: '0987654321',
    displayName: 'Trần Thị Thảo',
    password: '123456',
  },
  {
    id: 'user_003',
    username: 'hung_nguyen',
    email: 'nguyenvanhung.dev@gmail.com',
    phone: '0935123456',
    displayName: 'Nguyễn Văn Hùng',
    password: '123456',
  },
];

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

function parseIdentifier(value: string): { email?: string; phone?: string; username?: string } {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error('Vui lòng nhập email, số điện thoại hoặc tên đăng nhập.');
  }

  if (isEmail(trimmedValue)) {
    return { email: trimmedValue.toLowerCase() };
  }

  const normalizedPhone = normalizePhone(trimmedValue);
  if (normalizedPhone) {
    return { phone: normalizedPhone };
  }

  return { username: trimmedValue.toLowerCase() };
}

function loadStoredUsers(): AuthUser[] {
  let stored: AuthUser[] = [];
  if (typeof window !== 'undefined') {
    const rawValue = window.localStorage.getItem(USER_STORAGE_KEY);
    if (rawValue) {
      try {
        stored = JSON.parse(rawValue) as AuthUser[];
      } catch {
        stored = [];
      }
    }
  }

  const userMap = new Map<string, AuthUser>();
  for (const demoUser of DEFAULT_DEMO_USERS) {
    userMap.set(demoUser.id, demoUser);
  }
  for (const user of stored) {
    userMap.set(user.id, user);
  }

  return Array.from(userMap.values());
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
  // 1. Try sending request to Backend FastAPI / MongoDB first
  try {
    const response = await apiClient.post('/auth/register', {
      username: payload.username,
      email_or_phone: payload.emailOrPhone,
      display_name: payload.displayName,
      password: payload.password,
    });

    if (response.data && response.data.user) {
      const user: AuthUser = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phone,
        displayName: response.data.user.displayName || payload.displayName || payload.username,
        password: payload.password,
      };
      saveCurrentUser(user);

      // also save to local cache
      const users = loadStoredUsers();
      users.push(user);
      saveStoredUsers(users);

      return {
        user,
        message: response.data.message || 'Đăng ký tài khoản thành công vào MongoDB.',
      };
    }
  } catch (apiError: any) {
    if (apiError.response?.data?.detail) {
      throw new Error(apiError.response.data.detail);
    }
    // Fallback to local execution if backend isn't reachable
  }

  // 2. Local fallback registration
  const users = loadStoredUsers();
  const identifier = parseIdentifier(payload.emailOrPhone);

  const existingUser = users.find((user) => {
    const sameEmail = Boolean(identifier.email && user.email?.toLowerCase() === identifier.email);
    const samePhone = Boolean(identifier.phone && user.phone === identifier.phone);
    const sameUsername = Boolean(payload.username && user.username?.toLowerCase() === payload.username.trim().toLowerCase());
    return sameEmail || samePhone || sameUsername;
  });

  if (existingUser) {
    throw new Error('Email, số điện thoại hoặc tên đăng nhập này đã được sử dụng.');
  }

  if (payload.password !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp.');
  }

  const newUser: AuthUser = {
    id: `user_${Date.now()}`,
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
  // 1. Try Backend FastAPI / MongoDB login first
  try {
    const response = await apiClient.post('/auth/login', {
      email_or_phone: payload.emailOrPhone,
      password: payload.password,
    });

    if (response.data && response.data.user) {
      const user: AuthUser = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phone,
        displayName: response.data.user.displayName || payload.emailOrPhone,
        password: payload.password,
      };

      saveCurrentUser(user);

      return {
        user,
        message: response.data.message || 'Đăng nhập thành công từ MongoDB.',
      };
    }
  } catch (apiError: any) {
    if (apiError.response?.data?.detail) {
      throw new Error(apiError.response.data.detail);
    }
    // Fallback to local authentication if backend endpoint unreachable
  }

  // 2. Local fallback login logic
  const users = loadStoredUsers();
  const rawInput = payload.emailOrPhone.trim().toLowerCase();

  const matchedUser = users.find((user) => {
    const matchUser = user.username?.toLowerCase() === rawInput;
    const matchEmail = user.email?.toLowerCase() === rawInput;
    const matchPhone = user.phone === rawInput;
    return matchUser || matchEmail || matchPhone;
  });

  if (!matchedUser) {
    throw new Error('Email/số điện thoại hoặc tên đăng nhập chưa tồn tại trên hệ thống.');
  }

  if (matchedUser.password !== payload.password) {
    throw new Error('Mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc sử dụng tính năng "Quên mật khẩu".');
  }

  saveCurrentUser(matchedUser);

  return {
    user: matchedUser,
    message: 'Đăng nhập thành công.',
  };
}

export async function requestPasswordResetOTP(emailOrPhone: string): Promise<{ otpCode: string; message: string }> {
  // 1. Try Backend FastAPI / MongoDB request OTP first
  try {
    const response = await apiClient.post('/auth/forgot-password/request-otp', {
      email_or_phone: emailOrPhone,
    });

    if (response.data) {
      return {
        otpCode: response.data.otpCode || '888999',
        message: response.data.message || `Mã OTP xác thực đã được gửi tới ${emailOrPhone}.`,
      };
    }
  } catch (apiError: any) {
    if (apiError.response?.data?.detail) {
      throw new Error(apiError.response.data.detail);
    }
  }

  // 2. Local fallback request OTP
  const users = loadStoredUsers();
  const rawInput = emailOrPhone.trim().toLowerCase();

  const user = users.find((u) => {
    return u.email?.toLowerCase() === rawInput || u.phone === rawInput || u.username?.toLowerCase() === rawInput;
  });

  if (!user) {
    throw new Error('Không tìm thấy tài khoản với email/số điện thoại này.');
  }

  const otpCode = '888999';

  if (typeof window !== 'undefined') {
    const otpSessions = JSON.parse(window.localStorage.getItem(OTP_STORAGE_KEY) || '{}');
    otpSessions[rawInput] = {
      otpCode,
      userId: user.id,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    window.localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpSessions));
  }

  return {
    otpCode,
    message: `Mã OTP xác thực đã được gửi về ${emailOrPhone}. (Mã OTP mẫu: ${otpCode})`,
  };
}

export async function resetPasswordWithOTP(
  emailOrPhone: string,
  otpCode: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ message: string }> {
  if (newPassword !== confirmPassword) {
    throw new Error('Mật khẩu mới và mật khẩu xác nhận không khớp.');
  }

  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải chứa ít nhất 6 ký tự.');
  }

  // 1. Try Backend FastAPI / MongoDB password reset
  try {
    const response = await apiClient.post('/auth/forgot-password/reset', {
      email_or_phone: emailOrPhone,
      otp_code: otpCode,
      new_password: newPassword,
    });

    if (response.data) {
      return {
        message: response.data.message || 'Đặt lại mật khẩu thành công trong MongoDB!',
      };
    }
  } catch (apiError: any) {
    if (apiError.response?.data?.detail) {
      throw new Error(apiError.response.data.detail);
    }
  }

  // 2. Local fallback password reset
  const users = loadStoredUsers();
  const rawInput = emailOrPhone.trim().toLowerCase();

  let isValidOTP = false;
  let userIdToUpdate = '';

  if (typeof window !== 'undefined') {
    const otpSessions = JSON.parse(window.localStorage.getItem(OTP_STORAGE_KEY) || '{}');
    const session = otpSessions[rawInput];
    if (session && session.otpCode === otpCode.trim()) {
      isValidOTP = true;
      userIdToUpdate = session.userId;
    }
  }

  if (!isValidOTP && otpCode.trim() === '888999') {
    isValidOTP = true;
  }

  if (!isValidOTP) {
    throw new Error('Mã OTP không chính xác hoặc đã hết hạn.');
  }

  let userUpdated = false;
  const updatedUsers = users.map((user) => {
    const matchId = user.id === userIdToUpdate;
    const matchEmail = user.email?.toLowerCase() === rawInput;
    const matchPhone = user.phone === rawInput;
    const matchUser = user.username?.toLowerCase() === rawInput;

    if (matchId || matchEmail || matchPhone || matchUser) {
      userUpdated = true;
      return { ...user, password: newPassword };
    }
    return user;
  });

  if (!userUpdated) {
    throw new Error('Không tìm thấy tài khoản cần cập nhật mật khẩu.');
  }

  saveStoredUsers(updatedUsers);

  if (typeof window !== 'undefined') {
    const otpSessions = JSON.parse(window.localStorage.getItem(OTP_STORAGE_KEY) || '{}');
    delete otpSessions[rawInput];
    window.localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpSessions));
  }

  return {
    message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.',
  };
}
