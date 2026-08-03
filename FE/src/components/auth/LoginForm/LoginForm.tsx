import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { loginWithGoogle, loginWithFacebook, loginWithEmailPassword } from '../../../services/auth.service';
import './LoginForm.css';

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword?: () => void;
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onSwitchToForgotPassword,
  onSuccess,
}) => {
  const { refreshAccount } = useAuth();
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại.');
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    try {
      await loginWithFacebook();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Facebook thất bại.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginWithEmailPassword({
        email: formData.emailOrPhone,
        password: formData.password,
      });
      await refreshAccount();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-card">
      <div className="login-form-glow-top" />
      <div className="login-form-glow-bottom" />

      <div className="login-form-header">
        <div className="login-form-badge">
          <span className="login-form-badge-dot" />
          <span className="login-form-badge-text">ĐĂNG NHẬP HỆ THỐNG</span>
        </div>
        <h1 className="login-form-title">Chào mừng bạn trở lại!</h1>
        <p className="login-form-subtitle">Vui lòng nhập Email / Số điện thoại và mật khẩu để tiếp tục.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form-body">
        <div className="login-form-group">
          <label className="login-form-label">Email hoặc Số điện thoại</label>
          <input
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="email@example.com hoặc 0912345678"
            required
            className="login-form-input"
          />
        </div>

        <div className="login-form-group">
          <div className="login-form-label-row">
            <label className="login-form-label">Mật khẩu</label>
            {onSwitchToForgotPassword && (
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="btn-switch-link"
              >
                Quên mật khẩu?
              </button>
            )}
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
            className="login-form-input"
          />
        </div>

        {error ? <p className="login-form-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting} className="login-form-submit">
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <p className="login-form-footer-note">
          Dữ liệu được bảo mật và tự động phân quyền theo vai trò trong hệ thống.
        </p>

        <div className="login-form-divider">
          <span className="login-form-divider-line" />
          <span className="login-form-divider-text">HOẶC</span>
          <span className="login-form-divider-line" />
        </div>

        <div className="login-form-socials">
          <button type="button" onClick={handleGoogleLogin} className="btn-social-google">
            <span className="btn-social-icon-google">G</span>
            <span>Google</span>
          </button>
          <button type="button" onClick={handleFacebookLogin} className="btn-social-facebook">
            <span className="btn-social-icon-facebook">F</span>
            <span>Facebook</span>
          </button>
        </div>
      </form>

      <div className="login-form-switch">
        Chưa có tài khoản?{' '}
        <button type="button" onClick={onSwitchToRegister} className="btn-switch-link">
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
