import React, { useMemo } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { account, firebaseUser, logout } = useAuth();

  const userName = useMemo(
    () => account?.display_name || account?.username || firebaseUser?.displayName || 'Người dùng',
    [account, firebaseUser]
  );

  return (
    <AppRoutes
      userName={userName}
      onLogout={logout}
    />
  );
}
