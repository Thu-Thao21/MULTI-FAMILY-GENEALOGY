import React, { useMemo, useState } from 'react';
import AppRoutes, { type AuthView } from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { account, firebaseUser, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<AuthView>('login');

  const userName = useMemo(
    () => account?.display_name || account?.username || firebaseUser?.displayName || 'Người dùng',
    [account, firebaseUser]
  );

  const userRoles = useMemo(() => {
    if (!account?.roles) return [];
    return account.roles
      .filter((r) => r.status === 'active')
      .map((r) => r.role);
  }, [account]);

  const handleAuthSuccess = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setView('login');
  };

  return (
    <AppRoutes
      view={isAuthenticated ? 'dashboard' : view}
      onNavigate={setView}
      onAuthSuccess={handleAuthSuccess}
      userName={userName}
      userRoles={userRoles}
      onLogout={handleLogout}
    />
  );
}
