import React, { useMemo } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { account, firebaseUser, isAuthenticated, logout } = useAuth();

  const userName = useMemo(
    () => account?.display_name || account?.username || firebaseUser?.displayName || 'Người dùng',
    [account, firebaseUser]
  );

  const primaryRole = account?.primary_role || 'member';

  return (
    <AppRoutes
      userName={userName}
      primaryRole={primaryRole}
      isAuthenticated={isAuthenticated}
      onLogout={logout}
    />
  );
}
