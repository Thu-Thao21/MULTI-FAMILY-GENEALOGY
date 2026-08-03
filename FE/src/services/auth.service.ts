import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  FacebookAuthProvider,
  linkWithCredential,
  RecaptchaVerifier,
  type UserCredential,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';
import apiClient from '../api/axios';
import type { AccountProfile } from '../context/AuthContext';

export interface RegisterPayload {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
  role?: 'family_head' | 'member' | string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: 'member' | 'family_head' | 'admin' | string;
}

export function handleAuthError(err: any, providerName: string): string {
  console.error(`${providerName} Auth Error:`, err);
  const code = err.code || '';
  if (code === 'auth/invalid-api-key') {
    return 'Firebase API Key không hợp lệ. Vui lòng kiểm tra file FE/.env.';
  }
  if (code === 'auth/configuration-not-found') {
    return 'Cấu hình Firebase Auth chưa đầy đủ trong Firebase Console.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Tên miền hiện tại chưa được cấp phép trong Firebase Console (Authentication -> Settings -> Authorized domains).';
  }
  if (code === 'auth/operation-not-allowed') {
    return `Đăng nhập ${providerName} chưa được kích hoạt trong Firebase Console (Authentication -> Sign-in method).`;
  }
  if (code === 'auth/popup-blocked') {
    return 'Trình duyệt đã chặn cửa sổ Popup đăng nhập. Ứng dụng sẽ tự động chuyển hướng đăng nhập...';
  }
  if (code === 'auth/popup-closed-by-user') {
    return `Bạn đã đóng cửa sổ đăng nhập ${providerName}.`;
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Yêu cầu đăng nhập đã bị hủy.';
  }
  if (code === 'auth/account-exists-with-different-credential') {
    return 'Email của tài khoản này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng Email/Google trước.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.';
  }
  if (code === 'auth/invalid-email') {
    return 'Định dạng email không hợp lệ.';
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
    return 'Email hoặc mật khẩu không chính xác.';
  }
  if (code === 'auth/network-request-failed' || (err.message && (err.message.includes('Network Error') || err.message.includes('ERR_CONNECTION_REFUSED')))) {
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc máy chủ Backend.';
  }
  return err.message || `Thao tác ${providerName} thất bại.`;
}

/**
 * Process redirect authentication result (called on app startup after page reload from signInWithRedirect)
 */
export async function processAuthRedirectResult(): Promise<AccountProfile | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const token = await result.user.getIdToken();
      const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    }
  } catch (err: any) {
    console.error('Error processing redirect result:', err);
    throw new Error(handleAuthError(err, 'Redirect Auth'));
  }
  return null;
}

/**
 * Register new user with Email/Password via Firebase Auth.
 * Automatically sends email verification and bootstraps account in PostgreSQL backend.
 */
export async function registerWithEmailPassword(payload: RegisterPayload): Promise<AccountProfile> {
  const emailInput = payload.email.trim();
  if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không trùng khớp.');
  }

  if (payload.password.length < 6) {
    throw new Error('Mật khẩu phải chứa ít nhất 6 ký tự.');
  }

  try {
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      emailInput,
      payload.password
    );

    if (payload.displayName && credential.user) {
      await updateProfile(credential.user, { displayName: payload.displayName.trim() });
    }

    if (credential.user) {
      await sendEmailVerification(credential.user);
    }

    const token = await credential.user.getIdToken();
    const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(handleAuthError(err, 'Đăng ký Email'));
  }
}

/**
 * Login existing user with Email/Password via Firebase Auth.
 * Bootstraps and returns PostgreSQL account details.
 */
export async function loginWithEmailPassword(payload: LoginPayload): Promise<AccountProfile> {
  try {
    const credential = await signInWithEmailAndPassword(auth, payload.email.trim(), payload.password);
    const token = await credential.user.getIdToken();
    const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(handleAuthError(err, 'Đăng nhập Email'));
  }
}

/**
 * Login / Register with Google Sign-In (Popup with Redirect fallback).
 */
export async function loginWithGoogle(): Promise<AccountProfile | null> {
  try {
    let credential;
    try {
      credential = await signInWithPopup(auth, googleProvider);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw popupErr;
    }
    const token = await credential.user.getIdToken();
    const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(handleAuthError(err, 'Google'));
  }
}

/**
 * Login / Register with Facebook Login (Popup with Redirect fallback & linking check).
 */
export async function loginWithFacebook(): Promise<AccountProfile | null> {
  try {
    let credential;
    try {
      credential = await signInWithPopup(auth, facebookProvider);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, facebookProvider);
        return null;
      }
      if (popupErr.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = FacebookAuthProvider.credentialFromError(popupErr);
        if (auth.currentUser && pendingCred) {
          await linkWithCredential(auth.currentUser, pendingCred);
          const token = await auth.currentUser.getIdToken();
          const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.data;
        } else {
          sessionStorage.setItem('pending_fb_credential', JSON.stringify(popupErr.customData || {}));
          throw new Error('Email này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng Email/Google trước.');
        }
      }
      throw popupErr;
    }
    const token = await credential.user.getIdToken();
    const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(handleAuthError(err, 'Facebook'));
  }
}

/**
 * Send password reset email link via Firebase Auth.
 */
export async function sendPasswordResetLink(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    throw new Error(handleAuthError(err, 'Khôi phục mật khẩu'));
  }
}

/**
 * Request Password Reset OTP (Backend Service)
 */
export async function requestPasswordResetOTP(emailOrPhone: string): Promise<{ message: string }> {
  const input = emailOrPhone.trim();
  try {
    const res = await apiClient.post<{ message: string }>('/auth/request-otp', {
      email_or_phone: input,
    });
    return { message: res.data.message };
  } catch (err: any) {
    const msg = err.response?.data?.detail || err.message || 'Gửi mã OTP thất bại.';
    throw new Error(msg);
  }
}

/**
 * Reset Password with OTP Code
 */
export async function resetPasswordWithOTP(
  emailOrPhone: string,
  otpCode: string,
  newPassword: string,
  confirmPassword?: string
): Promise<{ message: string }> {
  if (confirmPassword && newPassword !== confirmPassword) {
    throw new Error('Mật khẩu xác nhận không trùng khớp.');
  }
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải từ 6 ký tự trở lên.');
  }
  try {
    const res = await apiClient.post<{ message: string }>('/auth/reset-password', {
      email_or_phone: emailOrPhone.trim(),
      otp_code: otpCode.trim(),
      new_password: newPassword,
    });
    return { message: res.data.message };
  } catch (err: any) {
    const msg = err.response?.data?.detail || err.message || 'Đặt lại mật khẩu thất bại.';
    throw new Error(msg);
  }
}

/**
 * Setup RecaptchaVerifier for Phone Auth.
 */
export function setupPhoneRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {},
  });
}

/**
 * Normalize phone number to E.164 standard format (+84...)
 */
export function formatPhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('84')) return `+${digits}`;
  if (digits.startsWith('0')) return `+84${digits.slice(1)}`;
  if (digits.length >= 9) return `+84${digits}`;
  return `+${digits}`;
}

/**
 * Send SMS OTP using Firebase Phone Auth.
 */
export async function sendPhoneOtp(phone: string, recaptchaVerifier: any): Promise<any> {
  const e164Phone = formatPhoneE164(phone);
  if (!e164Phone || e164Phone.length < 11) {
    throw new Error('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678).');
  }

  try {
    const { signInWithPhoneNumber } = await import('firebase/auth');
    const confirmationResult = await signInWithPhoneNumber(auth, e164Phone, recaptchaVerifier);
    return confirmationResult;
  } catch (err: any) {
    throw new Error(handleAuthError(err, 'Gửi SMS OTP'));
  }
}

/**
 * Verify SMS OTP code and bootstrap user in PostgreSQL.
 */
export async function verifyPhoneOtp(confirmationResult: any, otpCode: string): Promise<AccountProfile> {
  try {
    const credential = await confirmationResult.confirm(otpCode.trim());
    const token = await credential.user.getIdToken();
    const res = await apiClient.post<AccountProfile>('/auth/bootstrap', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    console.error('Verify OTP Error:', err);
    throw new Error('Mã OTP không đúng hoặc đã hết hạn.');
  }
}
