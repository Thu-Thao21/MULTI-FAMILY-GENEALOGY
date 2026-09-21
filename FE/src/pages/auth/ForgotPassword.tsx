import React from 'react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import AuthLanding from '../../components/auth/AuthLanding';
import loginBackground from '../../assets/nenan.png';

export interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchToLogin }) => {
  return (
    <AuthLanding
      title="Khôi phục tài khoản gia tộc"
      subtitle="Xác thực OTP qua email hoặc số điện thoại để cài đặt mật khẩu mới an toàn."
      backgroundImage={loginBackground}
    >
      <ForgotPasswordForm onSwitchToLogin={onSwitchToLogin} />
    </AuthLanding>
  );
};

export default ForgotPasswordPage;
