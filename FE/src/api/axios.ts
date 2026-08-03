import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.headers.Authorization) {
      return config;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await Promise.race([
          user.getIdToken(false),
          new Promise<string>((_, reject) => setTimeout(() => reject(new Error('getIdToken timeout')), 3000)),
        ]);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      } catch (e) {
        console.warn('Unable to get Firebase ID token:', e);
      }
    }
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - Token may be invalid or expired.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
