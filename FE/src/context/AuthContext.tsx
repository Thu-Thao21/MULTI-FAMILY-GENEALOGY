import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, sendEmailVerification, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import apiClient from '../api/axios';
import { processAuthRedirectResult } from '../services/auth.service';

export interface AccountRoleInfo {
  id: string;
  role: string;
  family_id?: string | null;
  status: string;
}

export interface AccountProfile {
  id: string;
  firebase_uid: string;
  username?: string | null;
  email?: string | null;
  phone_e164?: string | null;
  display_name?: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  status: string;
  roles: AccountRoleInfo[];
  primary_role: 'admin' | 'family_head' | 'member' | string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  account: AccountProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  primaryRole: string;
  refreshAccount: () => Promise<AccountProfile | null>;
  sendVerificationEmail: () => Promise<void>;
  reloadUserStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [account, setAccount] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAccount = async (): Promise<AccountProfile | null> => {
    try {
      const response = await apiClient.get<AccountProfile>('/auth/me');
      setAccount(response.data);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch account profile from /auth/me, trying bootstrap...', error);
      try {
        const bsResponse = await apiClient.post<AccountProfile>('/auth/bootstrap');
        setAccount(bsResponse.data);
        return bsResponse.data;
      } catch (bsErr) {
        console.error('Failed to bootstrap account in AuthContext:', bsErr);
        setAccount(null);
        return null;
      }
    }
  };

  const sendVerificationEmail = async (): Promise<void> => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('Chưa đăng nhập tài khoản.');
    }
  };

  const reloadUserStatus = async (): Promise<void> => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      await fetchAccount();
    }
  };

  useEffect(() => {
    // 1. Process redirect result first if returning from redirect sign-in flow
    processAuthRedirectResult().catch((err) => {
      console.warn('Redirect result check:', err.message);
    });

    // 2. Clear old legacy token if present in local storage
    localStorage.removeItem('auth_token');

    // 3. Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchAccount();
      } else {
        setAccount(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('auth_token');
      await signOut(auth);
      setFirebaseUser(null);
      setAccount(null);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setLoading(false);
    }
  };

  const primaryRole = account?.primary_role || 'member';

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        account,
        isAuthenticated: Boolean(firebaseUser && account),
        loading,
        primaryRole,
        refreshAccount: fetchAccount,
        sendVerificationEmail,
        reloadUserStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
