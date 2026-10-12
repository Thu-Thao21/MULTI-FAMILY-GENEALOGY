import React from 'react';
import ForgotPasswordForm from '../../components/common/auth/ForgotPasswordForm';
import AuthLanding from '../../components/common/auth/AuthLanding';
import loginBackground from '../../assets/nenan.png';

export interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchToLogin }) => {
  return (
    <AuthLanding
      title="Khôi phục tài khoản gia tộc"
      subtitle="Nhận liên kết đặt lại mật khẩu an toàn trực tiếp từ Firebase Authentication."
      backgroundImage={loginBackground}
    >
      <ForgotPasswordForm onSwitchToLogin={onSwitchToLogin} />
    </AuthLanding>
  );
};

export default ForgotPasswordPage;
