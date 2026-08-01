import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import AuthLanding from '../../components/auth/AuthLanding';
import loginBackground from '../../assets/nenan.png';

export interface LoginPageProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword?: () => void;
  onSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onSwitchToForgotPassword, onSuccess }) => {
  return (
    <AuthLanding
      title="Kết nối các dòng họ, lưu giữ nguồn cội"
      subtitle="Quản lý gia phả, khám phá quan hệ họ hàng và kết nối các dòng họ nội – ngoại – dâu – rể."
      backgroundImage={loginBackground}
    >
      <LoginForm
        onSwitchToRegister={onSwitchToRegister}
        onSwitchToForgotPassword={onSwitchToForgotPassword}
        onSuccess={onSuccess}
      />
    </AuthLanding>
  );
};

export default LoginPage;
