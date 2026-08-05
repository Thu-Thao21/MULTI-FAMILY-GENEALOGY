import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import { ProtectedRoute, RoleGuard } from './RouteGuards';

export type AuthView = 'login' | 'register' | 'forgot-password' | 'dashboard';

interface AppRoutesProps {
  userName: string;
  primaryRole: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  userName,
  primaryRole,
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    if (primaryRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={primaryRole === 'admin' ? '/admin' : '/user'} replace />
          ) : (
            <LoginPage
              onSwitchToRegister={() => navigate('/register')}
              onSwitchToForgotPassword={() => navigate('/forgot-password')}
              onSuccess={handleAuthSuccess}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          <RegisterPage
            onSwitchToLogin={() => navigate('/login')}
            onSuccess={handleAuthSuccess}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage onSwitchToLogin={() => navigate('/login')} />
        }
      />
      <Route
        path="/user/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['member', 'family_head']}>
              <Dashboard userName={userName} onLogout={handleLogout} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <Dashboard userName={userName} onLogout={handleLogout} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to={primaryRole === 'admin' ? '/admin' : '/user'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
