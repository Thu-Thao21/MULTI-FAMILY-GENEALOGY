import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
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
  const { login } = useAuth();
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
      await login({ emailOrPhone: formData.emailOrPhone, password: formData.password });
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
          <span className="login-form-badge-text">ĐĂNG NHẬP NGAY</span>
        </div>
        <h1 className="login-form-title">Chào mừng bạn trở lại!</h1>
        <p className="login-form-subtitle">Đăng nhập để tiếp tục khám phá gia phả và kết nối các dòng họ.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form-body">
        <div className="login-form-group">
          <label className="login-form-label">Email hoặc số điện thoại</label>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="login-form-label">Mật khẩu</label>
            {onSwitchToForgotPassword && (
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="btn-switch-link"
                style={{ fontSize: '13px', fontWeight: 600 }}
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
        <p className="login-form-footer-note">An toàn với mã hóa, xác thực nhanh và bộ nhớ phiên ổn định.</p>

        <div className="login-form-divider">
          <span className="login-form-divider-line" />
          <span className="login-form-divider-text">HOẶC</span>
          <span className="login-form-divider-line" />
        </div>

        <div className="login-form-socials">
          <button type="button" className="btn-social-google">
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#f8fafc', color: '#1a73e8', fontWeight: 700 }}>G</span>
            <span style={{ fontWeight: 700 }}>Google</span>
          </button>
          <button type="button" className="btn-social-facebook">
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', color: '#ffffff', fontWeight: 700 }}>F</span>
            <span style={{ fontWeight: 700 }}>Facebook</span>
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
