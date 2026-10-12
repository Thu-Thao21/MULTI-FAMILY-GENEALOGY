import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  type AuthError,
  type User,
} from 'firebase/auth';

import { auth, facebookProvider, googleProvider } from '../config/firebase';
import type { AccountProfile } from '../context/AuthContext';
import apiClient, { getApiErrorMessage } from './api';

export interface RegisterPayload {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

function firebaseMessage(error: unknown, fallback: string): string {
  const code = (error as AuthError | undefined)?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký.';
    case 'auth/invalid-email':
      return 'Định dạng email không hợp lệ.';
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác.';
    case 'auth/weak-password':
      return 'Mật khẩu phải có ít nhất 6 ký tự.';
    case 'auth/operation-not-allowed':
      return 'Phương thức đăng nhập này chưa được bật trong Firebase.';
    case 'auth/unauthorized-domain':
      return 'Domain hiện tại chưa được Firebase cho phép.';
    case 'auth/popup-closed-by-user':
      return 'Bạn đã đóng cửa sổ đăng nhập.';
    default:
      return error instanceof Error ? error.message : fallback;
  }
}

async function loadBackendProfile(user: User, endpoint = '/api/auth/me'): Promise<AccountProfile> {
  const token = await user.getIdToken(false);
  try {
    const response = endpoint === '/api/auth/me'
      ? await apiClient.get<AccountProfile>(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : await apiClient.post<AccountProfile>(endpoint, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Firebase đăng nhập thành công nhưng Backend từ chối hồ sơ.'));
  }
}

export async function registerWithEmailPassword(payload: RegisterPayload): Promise<AccountProfile> {
  const email = payload.email.trim();
  if (!email.includes('@')) throw new Error('Đăng ký hiện yêu cầu email Firebase hợp lệ.');
  if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không trùng khớp.');
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, payload.password);
    const displayName = payload.displayName?.trim() || payload.username?.trim() || email.split('@')[0];
    await updateProfile(credential.user, { displayName });
    await credential.user.getIdToken(true);
    await sendEmailVerification(credential.user);
    return await loadBackendProfile(credential.user, '/api/auth/register');
  } catch (error) {
    throw new Error(firebaseMessage(error, 'Đăng ký Firebase thất bại.'));
  }
}

export async function loginWithEmailPassword(payload: LoginPayload): Promise<AccountProfile> {
  try {
    const credential = await signInWithEmailAndPassword(auth, payload.email.trim(), payload.password);
    await credential.user.getIdToken(false);
    return await loadBackendProfile(credential.user);
  } catch (error) {
    if ((error as AuthError | undefined)?.code) {
      throw new Error(firebaseMessage(error, 'Đăng nhập Firebase thất bại.'));
    }
    throw error;
  }
}

async function loginWithProvider(
  provider: typeof googleProvider | typeof facebookProvider,
): Promise<AccountProfile | null> {
  try {
    const credential = await signInWithPopup(auth, provider);
    return await loadBackendProfile(credential.user);
  } catch (error) {
    if ((error as AuthError | undefined)?.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw new Error(firebaseMessage(error, 'Đăng nhập nhà cung cấp Firebase thất bại.'));
  }
}

export async function loginWithGoogle(): Promise<AccountProfile | null> {
  return loginWithProvider(googleProvider);
}

export async function loginWithFacebook(): Promise<AccountProfile | null> {
  return loginWithProvider(facebookProvider);
}

export async function sendPasswordResetLink(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    throw new Error(firebaseMessage(error, 'Không thể gửi email đặt lại mật khẩu.'));
  }
}
