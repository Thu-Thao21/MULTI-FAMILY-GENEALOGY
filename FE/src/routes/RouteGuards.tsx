import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './RouteGuards.css';

// Standard React Router v6 imports handled safely
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="route-loading-screen">
        <p>Đang xác thực thông tin tài khoản...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { account, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="route-loading-screen">
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  const activeRoles = account.roles
    .filter((r) => r.status === 'active')
    .map((r) => r.role.toLowerCase());

  // Super Admin has access to all spaces
  const hasAccess = activeRoles.includes('admin') || allowedRoles.some((r) => activeRoles.includes(r.toLowerCase()));

  if (!hasAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
