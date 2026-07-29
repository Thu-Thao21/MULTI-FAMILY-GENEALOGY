import React from 'react';
import LoginPage from '../features/authentication/pages/Login';
import RegisterPage from '../features/authentication/pages/Register';

export type AuthView = 'login' | 'register' | 'dashboard';

interface AppRoutesProps {
  view: AuthView;
  onNavigate: (view: AuthView) => void;
  onAuthSuccess: () => void;
  userName: string;
  onLogout: () => void;
}

const DashboardPage: React.FC<{ userName: string; onLogout: () => void }> = ({ userName, onLogout }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)', padding: '32px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#2563eb', fontWeight: 700, letterSpacing: '1px' }}>HOME</p>
        <h1 style={{ margin: '8px 0 12px', fontSize: '28px', color: '#0f172a' }}>Xin chào, {userName}</h1>
        <p style={{ margin: '0 0 20px', color: '#64748b' }}>Bạn đã đăng nhập thành công vào hệ thống genealogy.</p>
        <button
          type="button"
          onClick={onLogout}
          style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '999px', padding: '12px 20px', fontWeight: 600, cursor: 'pointer' }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

const AppRoutes: React.FC<AppRoutesProps> = ({ view, onNavigate, onAuthSuccess, userName, onLogout }) => {
  if (view === 'register') {
    return <RegisterPage onSwitchToLogin={() => onNavigate('login')} onSuccess={onAuthSuccess} />;
  }

  if (view === 'dashboard') {
    return <DashboardPage userName={userName} onLogout={onLogout} />;
  }

  return <LoginPage onSwitchToRegister={() => onNavigate('register')} onSuccess={onAuthSuccess} />;
};

export default AppRoutes;
