import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './RegisterForm.css';

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    emailOrPhone: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
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
      await register(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form-card">
      <div className="register-form-glow-top" />
      <div className="register-form-glow-bottom" />
      <div className="register-form-header">
        <div className="register-form-badge">
          <span className="register-form-badge-dot" />
          <span className="register-form-badge-text">BẮT ĐẦU NGAY</span>
        </div>
        <h1 className="register-form-title">Chào mừng bạn đến với Gia Phả Liên Họ!</h1>
        <p className="register-form-subtitle">Tạo tài khoản để bắt đầu kết nối với gia đình và dòng họ.</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form-body">
        <div className="register-form-group">
          <label className="register-form-label">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="vd: nguyen_van_a"
            required
            className="register-form-input"
          />
        </div>

        <div className="register-form-group">
          <label className="register-form-label">Email hoặc số điện thoại</label>
          <input
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="email@example.com hoặc 0912345678"
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
            placeholder="Nguyễn Văn A"
            className="register-form-input"
          />
        </div>

        <div className="register-form-group">
          <label className="register-form-label">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ít nhất 8 ký tự"
            required
            className="register-form-input"
          />
        </div>

        <div className="register-form-group">
          <label className="register-form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            required
            className="register-form-input"
          />
        </div>

        {error ? <p className="register-form-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting} className="register-form-submit">
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        <p className="register-form-footer-note">Bắt đầu hành trình gia phả với một tài khoản an toàn và đơn giản.</p>

        <div className="register-form-divider">
          <span className="register-form-divider-line" />
          <span className="register-form-divider-text">HOẶC</span>
          <span className="register-form-divider-line" />
        </div>

        <div className="register-form-socials">
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

      <div className="register-form-switch">
        Đã có tài khoản?{' '}
        <button type="button" onClick={onSwitchToLogin} className="btn-switch-link">
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
