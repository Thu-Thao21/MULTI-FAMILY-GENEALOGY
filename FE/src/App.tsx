import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import { FirstLoginPasswordModal } from './components/common/auth/FirstLoginPasswordModal';

export default function App() {
  const { account, firebaseUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const userName = useMemo(
    () => account?.display_name || account?.username || firebaseUser?.displayName || 'Người dùng',
    [account, firebaseUser]
  );

  const primaryRole = account?.primary_role || 'member';

  return (
    <>
      <AppRoutes
        userName={userName}
        primaryRole={primaryRole}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />

      {/* Phiên hạn chế (requires_password_change từ GET /auth/me): bắt buộc đổi mật khẩu trước */}
      <FirstLoginPasswordModal
        isOpen={Boolean(account?.requires_password_change)}
        onSuccess={() => navigate('/login', { replace: true })}
        onCancel={() => {
          void logout().then(() => navigate('/login', { replace: true }));
        }}
      />
    </>
  );
}
