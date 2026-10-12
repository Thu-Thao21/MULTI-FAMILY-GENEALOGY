import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../../../config/routes';
import { sendPasswordResetLink } from '../../../../services/auth.service';
import './ForgotPasswordForm.css';

export interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await sendPasswordResetLink(email);
      setSuccessMsg('Firebase đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra email.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể gửi email đặt lại mật khẩu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-form-card">
      <div className="forgot-form-glow-top" />
      <button
        type="button"
        onClick={() => navigate(ROUTES.PUBLIC.ROOT)}
        className="btn-back-home-icon"
        title="Quay lại trang chủ"
      >
        ←
      </button>

      <div className="forgot-form-header">
        <div className="forgot-form-badge">
          <span className="forgot-form-badge-dot" />
          <span className="forgot-form-badge-text">KHÔI PHỤC MẬT KHẨU FIREBASE</span>
        </div>
        <h1 className="forgot-form-title">Quên mật khẩu?</h1>
      </div>

      <form onSubmit={handleSubmit} className="forgot-form-body">
        <div className="forgot-form-group">
          <label className="forgot-form-label">Email Firebase</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            required
            className="forgot-form-input"
          />
        </div>

        {error ? <p className="forgot-form-error">{error}</p> : null}
        {successMsg ? <p className="forgot-form-success">{successMsg}</p> : null}

        <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
          {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
        </button>
      </form>

      <div className="forgot-form-switch">
        Nhớ mật khẩu?{' '}
        <button type="button" onClick={onSwitchToLogin} className="btn-switch-link">
          Quay lại Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
