import React from 'react';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';

export type AuthView = 'login' | 'register' | 'dashboard';

interface AppRoutesProps {
  view: AuthView;
  onNavigate: (view: AuthView) => void;
  onAuthSuccess: () => void;
  userName: string;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ view, onNavigate, onAuthSuccess, userName, onLogout }) => {
  if (view === 'register') {
    return <RegisterPage onSwitchToLogin={() => onNavigate('login')} onSuccess={onAuthSuccess} />;
  }

  if (view === 'dashboard') {
    return <Dashboard userName={userName} onLogout={onLogout} />;
  }

  return <LoginPage onSwitchToRegister={() => onNavigate('register')} onSuccess={onAuthSuccess} />;
};

export default AppRoutes;
