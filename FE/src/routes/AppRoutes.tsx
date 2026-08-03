import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import FamilyHeadDashboard from '../pages/dashboard/FamilyHeadDashboard';
import MemberDashboard from '../pages/dashboard/MemberDashboard';
import ForbiddenPage from '../pages/dashboard/Forbidden';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, primaryRole } = useAuthContext();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#2563eb', fontWeight: 'bold' }}>Đang tải trạng thái xác thực hệ thống...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(primaryRole)) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, primaryRole } = useAuthContext();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#2563eb', fontWeight: 'bold' }}>Đang tải trạng thái xác thực...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (primaryRole === 'admin') return <Navigate to="/admin" replace />;
    if (primaryRole === 'family_head') return <Navigate to="/family-head" replace />;
    return <Navigate to="/member" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { primaryRole, isAuthenticated } = useAuthContext();

  const handleAuthSuccess = () => {
    if (primaryRole === 'admin') navigate('/admin');
    else if (primaryRole === 'family_head') navigate('/family-head');
    else navigate('/member');
  };

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage
              onSwitchToRegister={() => navigate('/register')}
              onSwitchToForgotPassword={() => navigate('/forgot-password')}
              onSuccess={handleAuthSuccess}
            />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage
              onSwitchToLogin={() => navigate('/login')}
              onSuccess={handleAuthSuccess}
            />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage onSwitchToLogin={() => navigate('/login')} />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Role Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family-head/*"
        element={
          <ProtectedRoute allowedRoles={['family_head', 'admin']}>
            <FamilyHeadDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/*"
        element={
          <ProtectedRoute allowedRoles={['member', 'family_head', 'admin']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      {/* Access Denied Route */}
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Default Fallback Redirect */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to={primaryRole === 'admin' ? '/admin' : primaryRole === 'family_head' ? '/family-head' : '/member'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
