import React from 'react';
import LoginForm from '../components/LoginForm';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onSuccess }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <LoginForm onSwitchToRegister={onSwitchToRegister} onSuccess={onSuccess} />
    </div>
  );
};

export default LoginPage;
