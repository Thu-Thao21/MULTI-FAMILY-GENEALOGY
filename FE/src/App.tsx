import React, { useMemo, useState } from 'react';
import AppRoutes, { type AuthView } from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [view, setView] = useState<AuthView>('login');

  const userName = useMemo(() => user?.displayName || user?.username || 'Người dùng', [user]);

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
      onLogout={handleLogout}
    />
  );
}
