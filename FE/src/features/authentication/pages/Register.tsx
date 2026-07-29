import React from 'react';
import RegisterForm from '../components/RegisterForm';
import AuthLanding from '../components/AuthLanding';
import registerBackground from '../../../assets/nenan.png';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onSuccess }) => {
  return (
    <AuthLanding
      title="Kết nối các dòng họ, lưu giữ nguồn cội"
      subtitle="Tạo tài khoản để quản lý gia phả, khám phá quan hệ họ hàng và kết nối các dòng họ nội – ngoại – dâu – rể."
      backgroundImage={registerBackground}
    >
      <RegisterForm onSwitchToLogin={onSwitchToLogin} onSuccess={onSuccess} />
    </AuthLanding>
  );
};

export default RegisterPage;