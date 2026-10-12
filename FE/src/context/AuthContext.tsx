import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';

import { auth } from '../config/firebase';
import apiClient, { getApiErrorMessage } from '../services/api';
import { loginWithEmailPassword } from '../services/auth.service';

export interface AccountRoleInfo {
  id: string;
  account_id: string;
  role: string;
  family_id?: string | null;
  granted_at: string;
  revoked_at?: string | null;
}

export interface AccountProfile {
  id: string;
  firebase_uid?: string | null;
  username?: string | null;
  email: string;
  phone_e164?: string | null;
  display_name: string;
  email_verified: boolean;
  phone_verified: boolean;
  first_login_required: boolean;
  last_login_at?: string | null;
  status: string;
  roles: AccountRoleInfo[];
  primary_role: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  backendUser: AccountProfile | null;
  account: AccountProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  primaryRole: string;
  roles: string[];
  login: (payload: { emailOrPhone: string; password: string }) => Promise<AccountProfile>;
  refreshAccount: () => Promise<AccountProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [account, setAccount] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = async (): Promise<AccountProfile | null> => {
    try {
      const response = await apiClient.get<AccountProfile>('/api/auth/me');
      setAccount(response.data);
      return response.data;
    } catch (error) {
      setAccount(null);
      throw new Error(getApiErrorMessage(error, 'Không tải được hồ sơ người dùng từ Backend.'));
    }
  };

  const login = async (payload: { emailOrPhone: string; password: string }): Promise<AccountProfile> => {
    const profile = await loginWithEmailPassword({
      email: payload.emailOrPhone,
      password: payload.password,
    });
    setAccount(profile);
    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          await fetchAccount();
        } catch {
          setAccount(null);
        }
      } else {
        setAccount(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const primaryRole = account?.primary_role || 'member';
  const roles = (account?.roles || [])
    .filter((assignment) => !assignment.revoked_at)
    .map((assignment) => assignment.role.toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        backendUser: account,
        account,
        isAuthenticated: Boolean(firebaseUser && account),
        loading,
        primaryRole,
        roles,
        login,
        refreshAccount: fetchAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
}
