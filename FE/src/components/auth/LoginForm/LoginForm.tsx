import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './LoginForm.css';

import { loginWithGoogle, loginWithFacebook } from '../../../services/auth.service';

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
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        role: selectedRole,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập Google thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await loginWithFacebook();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập Facebook thất bại.');
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
        <p className="login-form-subtitle">Vui lòng chọn vai trò và đăng nhập để truy cập dữ liệu.</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="login-role-selector">
        <button
          type="button"
          onClick={() => setSelectedRole('member')}
          className={`login-role-btn ${selectedRole === 'member' ? 'active' : ''}`}
        >
          Thành Viên
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('admin')}
          className={`login-role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form-body">
        <div className="login-form-group">
          <label className="login-form-label">
            {selectedRole === 'admin'
              ? 'Tên đăng nhập hoặc Email Admin'
              : 'Email / SĐT Thành Viên'}
          </label>
          <input
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder={
              selectedRole === 'admin'
                ? 'thuthaor120608@gmail.com'
                : 'email@example.com hoặc 0912345678'
            }
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
          {isSubmitting
            ? 'Đang đăng nhập...'
            : selectedRole === 'admin'
              ? 'Đăng nhập Quyền Admin'
              : 'Đăng nhập Quyền Thành Viên'}
        </button>

        <p className="login-form-footer-note">
          {selectedRole === 'admin'
            ? 'Tài khoản Admin đã được tạo sẵn trong hệ thống database.'
            : 'Dữ liệu được bảo mật và phân quyền truy cập theo vai trò.'}
        </p>

        {selectedRole !== 'admin' && (
          <>
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
          </>
        )}
      </form>

      {selectedRole !== 'admin' && (
        <div className="login-form-switch">
          Chưa có tài khoản?{' '}
          <button type="button" onClick={onSwitchToRegister} className="btn-switch-link">
            Đăng ký ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
