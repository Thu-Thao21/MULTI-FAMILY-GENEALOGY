import { useEffect, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/auth.service';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);
    setUser(response.user);
    return response;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await registerUser(payload);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };
}
