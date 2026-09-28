import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, loginWithFacebook, registerWithEmailPassword } from '../../../../../services/auth.service';
import { ROUTES } from '../../../../../config/routes';
import './RegisterForm.css';

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    emailOrPhone: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
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
      await registerWithEmailPassword({
        username: formData.username,
        email: formData.emailOrPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        displayName: formData.displayName,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form-card">
      <div className="register-form-glow-top" />

      <button
        type="button"
        onClick={() => navigate(ROUTES.PUBLIC.ROOT)}
        className="btn-back-home-icon"
        title="Quay lại trang chủ"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <div className="register-form-header">
        <div className="register-form-badge">
          <span className="register-form-badge-dot" />
          <span className="register-form-badge-text">ĐĂNG KÝ TÀI KHOẢN</span>
        </div>
        <h1 className="register-form-title">Tạo Tài Khoản Thành Viên</h1>
      </div>

      <form onSubmit={handleSubmit} className="register-form-body">
        <div className="register-form-row">
          <div className="register-form-group">
            <label className="register-form-label">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="VD: nguyenvana"
              required
              className="register-form-input"
            />
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Tên hiển thị</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="VD: Nguyễn Văn A"
              required
              className="register-form-input"
            />
          </div>
        </div>

        <div className="register-form-group">
          <label className="register-form-label">Email</label>
          <input
            type="email"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="nguyenvana@gmail.com"
            required
            className="register-form-input"
          />
        </div>

        <div className="register-form-row">
          <div className="register-form-group">
            <label className="register-form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              required
              className="register-form-input"
            />
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Nhập lại mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              required
              className="register-form-input"
            />
          </div>
        </div>

        {error ? <p className="register-form-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting} className="register-form-submit">
          {isSubmitting ? 'Đang khởi tạo...' : 'Tạo Tài Khoản'}
        </button>

        <div className="register-form-divider">
          <span className="register-form-divider-line" />
          <span className="register-form-divider-text">HOẶC ĐĂNG KÝ VỚI</span>
          <span className="register-form-divider-line" />
        </div>

        <div className="register-form-socials">
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

      <div className="register-form-switch">
        Đã có tài khoản?{' '}
        <button type="button" onClick={onSwitchToLogin} className="btn-switch-link">
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
