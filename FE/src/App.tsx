import React, { useMemo } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import bgImage from './assets/trong-dong-vector-1.jpg';

export default function App() {
  const { account, firebaseUser, isAuthenticated, logout } = useAuth();

  const userName = useMemo(
    () => account?.display_name || account?.username || firebaseUser?.displayName || 'Người dùng',
    [account, firebaseUser]
  );

  const primaryRole = account?.primary_role || 'member';

  return (
    <>
      {/* Watermark overlay - Nằm ở tầng nền phía sau, không đè lên nội dung */}
      <div 
        style={{
          position: 'fixed',
          bottom: '-15vh',
          right: '-15vh',
          width: '90vh',
          height: '90vh',
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <AppRoutes
          userName={userName}
          primaryRole={primaryRole}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
      </div>
    </>
  );
}
