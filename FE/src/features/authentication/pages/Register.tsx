import React from 'react';
import RegisterForm from '../components/RegisterForm';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onSuccess }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <RegisterForm onSwitchToLogin={onSwitchToLogin} onSuccess={onSuccess} />
    </div>
  );
};

export default RegisterPage;