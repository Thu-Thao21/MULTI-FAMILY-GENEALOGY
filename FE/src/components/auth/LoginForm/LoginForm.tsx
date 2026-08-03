import React, { useState, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  loginWithGoogle,
  loginWithFacebook,
  loginWithEmailPassword,
  sendPhoneOtp,
  verifyPhoneOtp,
  setupPhoneRecaptcha,
} from '../../../services/auth.service';
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
  const [loginMethod, setLoginMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [phoneStep, setPhoneStep] = useState<'SEND_OTP' | 'VERIFY_OTP'>('SEND_OTP');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaRef = useRef<any>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const res = await loginWithGoogle();
      if (res) {
        await refreshAccount();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại.');
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    try {
      const res = await loginWithFacebook();
      if (res) {
        await refreshAccount();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Facebook thất bại.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await loginWithEmailPassword({
        email: email.trim(),
        password: password,
      });
      await refreshAccount();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupPhoneRecaptcha('login-recaptcha');
      }
      const result = await sendPhoneOtp(phone, recaptchaRef.current);
      setConfirmationResult(result);
      setPhoneStep('VERIFY_OTP');
    } catch (err: any) {
      setError(err.message || 'Không thể gửi mã SMS OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!confirmationResult) {
        throw new Error('Chưa gửi mã OTP. Vui lòng thử lại.');
      }
      await verifyPhoneOtp(confirmationResult, otpCode);
      await refreshAccount();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Mã OTP không đúng.');
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
        <p className="login-form-subtitle">Vui lòng chọn phương thức đăng nhập bên dưới.</p>
      </div>

      <div id="login-recaptcha"></div>

      {/* Tabs Method Selection */}
      <div className="login-method-tabs">
        <button
          type="button"
          className={`login-tab-btn ${loginMethod === 'EMAIL' ? 'active' : ''}`}
          onClick={() => {
            setLoginMethod('EMAIL');
            setError('');
          }}
        >
          Đăng nhập Email
        </button>
        <button
          type="button"
          className={`login-tab-btn ${loginMethod === 'PHONE' ? 'active' : ''}`}
          onClick={() => {
            setLoginMethod('PHONE');
            setError('');
          }}
        >
          Đăng nhập SĐT (SMS OTP)
        </button>
      </div>

      {loginMethod === 'EMAIL' ? (
        <form onSubmit={handleEmailSubmit} className="login-form-body">
          <div className="login-form-group">
            <label className="login-form-label">Email tài khoản</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className="login-form-input"
            />
          </div>

          {error ? <p className="login-form-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="login-form-submit">
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập Email'}
          </button>
        </form>
      ) : (
        <div>
          {phoneStep === 'SEND_OTP' ? (
            <form onSubmit={handleSendPhoneOtp} className="login-form-body">
              <div className="login-form-group">
                <label className="login-form-label">Số điện thoại Việt Nam</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                  className="login-form-input"
                />
              </div>

              {error ? <p className="login-form-error">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="login-form-submit">
                {isSubmitting ? 'Đang gửi SMS...' : 'Gửi mã xác thực SMS OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyPhoneOtp} className="login-form-body">
              <div className="login-form-group">
                <label className="login-form-label">Mã 6 chữ số OTP từ SMS ({phone})</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="login-form-input"
                />
              </div>

              {error ? <p className="login-form-error">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="login-form-submit">
                {isSubmitting ? 'Đang xác minh...' : 'Xác nhận OTP & Đăng nhập'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="login-form-divider">
        <span className="login-form-divider-line" />
        <span className="login-form-divider-text">HOẶC DÙNG TÀI KHOẢN MẠNG XÃ HỘI</span>
        <span className="login-form-divider-line" />
      </div>

      <div className="login-form-socials">
        <button type="button" onClick={handleGoogleLogin} className="btn-social-google">
          <span className="btn-social-icon-google">G</span>
          <span>Đăng nhập Google</span>
        </button>
        <button type="button" onClick={handleFacebookLogin} className="btn-social-facebook">
          <span className="btn-social-icon-facebook">F</span>
          <span>Đăng nhập Facebook</span>
        </button>
      </div>

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
