import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { signOut } from 'firebase/auth';

import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

interface RetryableRequest extends InternalAxiosRequestConfig {
  _firebaseRetry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const user = auth.currentUser;
  if (user && !config.headers.Authorization) {
    const token = await user.getIdToken(false);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    if (error.response?.status === 401 && request && !request._firebaseRetry && auth.currentUser) {
      request._firebaseRetry = true;
      try {
        const refreshedToken = await auth.currentUser.getIdToken(true);
        request.headers.Authorization = `Bearer ${refreshedToken}`;
        return await apiClient.request(request);
      } catch {
        await signOut(auth);
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = 'Không thể kết nối Backend.') {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : fallback;

  const detail = error.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg).filter(Boolean).join('; ') || fallback;
  }

  switch (error.response?.status) {
    case 401:
      return 'Phiên đăng nhập Firebase không hợp lệ hoặc đã hết hạn.';
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này.';
    case 404:
      return 'Không tìm thấy dữ liệu yêu cầu.';
    case 409:
      return 'Dữ liệu bị trùng hoặc xung đột.';
    case 422:
      return 'Dữ liệu gửi lên chưa hợp lệ.';
    default:
      return error.message || fallback;
  }
}

export default apiClient;
