import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
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
  role?: 'member' | string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: 'member' | 'admin' | string;
}

function handleAuthError(err: any, providerName: string): string {
  console.error(`${providerName} Auth Error:`, err);
  const code = err.code || '';
  if (code === 'auth/popup-closed-by-user') {
    return `Bạn đã đóng cửa sổ đăng nhập ${providerName}.`;
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Yêu cầu đăng nhập đã bị hủy.';
  }
  if (code === 'auth/operation-not-allowed') {
    return `Đăng nhập ${providerName} chưa được kích hoạt trong Firebase Console. Vui lòng bật provider này trong Authentication -> Sign-in method.`;
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Tên miền hiện tại chưa được cấp phép trong Firebase Console (Authentication -> Settings -> Authorized domains).';
  }
  if (code === 'auth/account-exists-with-different-credential') {
    return 'Email của tài khoản này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng Email/Google trước.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Trình duyệt đã chặn cửa sổ Popup đăng nhập. Vui lòng bỏ chặn Popup hoặc cho phép pop-up từ trang web này.';
  }
  if (err.message && (err.message.includes('Network Error') || err.message.includes('ERR_CONNECTION_REFUSED'))) {
    return 'Không thể kết nối đến máy chủ Backend (FastAPI). Vui lòng kiểm tra xem server backend đã chạy hay chưa.';
  }
  return err.message || `Đăng nhập ${providerName} thất bại.`;
}

/**
 * Register new user with Email/Password via Firebase Auth.
 * Automatically sends email verification and bootstraps account in PostgreSQL.
 */
export async function registerWithEmailPassword(payload: RegisterPayload): Promise<AccountProfile> {
  const input = payload.email.trim();
  if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không trùng khớp.');
  }

  if (payload.password.length < 6) {
    throw new Error('Mật khẩu phải chứa ít nhất 6 ký tự.');
  }

  const isEmail = input.includes('@');

  if (isEmail) {
    try {
      const credential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        input,
        payload.password
      );

      if (payload.displayName && credential.user) {
        await updateProfile(credential.user, { displayName: payload.displayName.trim() });
      }

      if (credential.user) {
        await sendEmailVerification(credential.user);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Định dạng email không hợp lệ.');
      }
    }
  }

  // Always register in Backend PostgreSQL DB (supports both email and phone numbers!)
  try {
    const res = await apiClient.post('/auth/register', {
      username: payload.username || input.split('@')[0],
      email_or_phone: input,
      display_name: payload.displayName || payload.username || input,
      password: payload.password,
      role: payload.role || 'member',
    });

    const user = res.data?.user;
    return {
      id: user?.id || 'registered_user',
      firebase_uid: user?.id || 'registered_user',
      username: user?.username || input,
      email: isEmail ? input : null,
      phone_e164: !isEmail ? input : null,
      display_name: user?.displayName || payload.displayName || input,
      email_verified: isEmail,
      phone_verified: !isEmail,
      status: 'active',
      roles: [{ id: 'r1', role: payload.role || 'member', status: 'active' }],
      primary_role: payload.role || 'member',
    };
  } catch (err: any) {
    const msg = err.response?.data?.detail || err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
    throw new Error(msg);
  }
}

/**
 * Login existing user with Email/Password via Firebase Auth.
 * Automatically bootstraps and returns PostgreSQL account details.
 */
export async function loginWithEmailPassword(payload: LoginPayload): Promise<AccountProfile> {
  // 1. Try Backend API first (validates updated password_hash from password reset)
  try {
    const res = await apiClient.post('/auth/login', {
      email_or_phone: payload.email.trim(),
      password: payload.password,
      role: payload.role || 'member',
    });
    if (res.data && res.data.user) {
      if (res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
      }
      const u = res.data.user;
      return {
        id: u.id,
        firebase_uid: u.id,
        username: u.username,
        email: u.email || payload.email.trim(),
        phone_e164: u.phone,
        display_name: u.displayName || u.username || 'Thành viên',
        email_verified: true,
        phone_verified: false,
        status: 'active',
        roles: [{ id: u.id, role: u.role || 'member', status: 'active' }],
        primary_role: u.role || 'member',
      };
    }
  } catch (backendErr: any) {
    if (backendErr?.response?.data?.detail) {
      throw new Error(backendErr.response.data.detail);
    }
    if (backendErr?.message && (backendErr.message.includes('Network Error') || backendErr.message.includes('ERR_CONNECTION_REFUSED'))) {
      throw new Error('Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra kết nối mạng.');
    }
  }

  // 2. Fallback to Firebase Auth
  try {
    await signInWithEmailAndPassword(auth, payload.email.trim(), payload.password);
    const res = await apiClient.post<AccountProfile>('/auth/bootstrap');
    return res.data;
  } catch (err: any) {
    console.error('Email Login Error:', err);
    if (err.code === 'auth/invalid-email') {
      throw new Error('Định dạng Email không hợp lệ (ví dụ: your_name@gmail.com).');
    }
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }
    throw new Error(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
  }
}


/**
 * Login / Register with Google Sign-In.
 */
export async function loginWithGoogle(): Promise<AccountProfile> {
  try {
    let credential;
    try {
      credential = await signInWithPopup(auth, googleProvider);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return {} as AccountProfile;
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
 * Login / Register with Facebook Login.
 */
export async function loginWithFacebook(): Promise<AccountProfile> {
  try {
    let credential;
    try {
      credential = await signInWithPopup(auth, facebookProvider);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, facebookProvider);
        return {} as AccountProfile;
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
    console.error('Password Reset Error:', err);
    if (err.code === 'auth/user-not-found') {
      // Don't leak user existence for security
      return;
    }
    throw new Error(err.message || 'Không thể gửi email đặt lại mật khẩu.');
  }
}

/**
 * Normalize Vietnamese phone number to E.164 standard format (+84...)
 */
/**
 * Setup RecaptchaVerifier for Phone Auth.
 */
export function setupPhoneRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
  });
}

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
    console.error('SMS OTP Error:', err);
    if (err.code === 'auth/billing-not-enabled') {
      throw new Error(
        'Firebase bản miễn phí (Spark Plan) chặn bắn SMS thật tới số di động ngoài danh sách thử nghiệm.'
      );
    }
    if (err.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Firebase chưa cho phép gửi SMS về Việt Nam (+84). Vui lòng vào Firebase Console -> Authentication -> Settings -> SMS Region Policy -> Chọn Allow Việt Nam (+84).'
      );
    }
    if (err.code === 'auth/quota-exceeded') {
      throw new Error('Đã hết hạn ngạch (quota) gửi tin nhắn SMS của Firebase trong ngày.');
    }
    if (err.code === 'auth/invalid-phone-number') {
      throw new Error('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại số điện thoại.');
    }
    throw new Error(err.message || 'Gửi mã OTP qua SMS thất bại.');
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

/**
 * Request Password Reset (Supports Email & Phone OTP workflow)
 */
export async function requestPasswordResetOTP(emailOrPhone: string): Promise<{ message: string }> {
  const input = emailOrPhone.trim();
  try {
    const res = await apiClient.post<{ message: string; otp_code?: string }>('/auth/request-otp', {
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


