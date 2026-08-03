import React, { useState, useRef } from 'react';
import {
  loginWithGoogle,
  loginWithFacebook,
  registerWithEmailPassword,
  sendPhoneOtp,
  verifyPhoneOtp,
  setupPhoneRecaptcha,
} from '../../../services/auth.service';
import { useAuth } from '../../../hooks/useAuth';
import './RegisterForm.css';

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const { refreshAccount } = useAuth();
  const [registerMethod, setRegisterMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');

  // Email form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Phone form states
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

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithEmailPassword({
        username: username.trim(),
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword,
        displayName: displayName.trim(),
        role: 'member',
      });
      await refreshAccount();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại.');
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
        recaptchaRef.current = setupPhoneRecaptcha('register-recaptcha');
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
    <div className="register-form-card">
      <div className="register-form-glow-top" />
      <div className="register-form-glow-bottom" />

      <div className="register-form-header">
        <div className="register-form-badge">
          <span className="register-form-badge-dot" />
          <span className="register-form-badge-text">TẠO TÀI KHOẢN MỚI</span>
        </div>
        <h1 className="register-form-title">Tham gia Gia Phả Liên Họ!</h1>
        <p className="register-form-subtitle">Chọn phương thức đăng ký bên dưới.</p>
      </div>

      <div id="register-recaptcha"></div>

      {/* Tabs Selection */}
      <div className="register-method-tabs">
        <button
          type="button"
          className={`register-tab-btn ${registerMethod === 'EMAIL' ? 'active' : ''}`}
          onClick={() => {
            setRegisterMethod('EMAIL');
            setError('');
          }}
        >
          Đăng ký Email
        </button>
        <button
          type="button"
          className={`register-tab-btn ${registerMethod === 'PHONE' ? 'active' : ''}`}
          onClick={() => {
            setRegisterMethod('PHONE');
            setError('');
          }}
        >
          Đăng ký SĐT (SMS)
        </button>
      </div>

      {registerMethod === 'EMAIL' ? (
        <form onSubmit={handleEmailRegister} className="register-form-body">
          <div className="register-form-group">
            <label className="register-form-label">Tên đăng nhập (Username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vd: nguyen_van_a"
              required
              className="register-form-input"
            />
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Email tài khoản</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="register-form-input"
            />
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Tên hiển thị / Họ tên</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="register-form-input"
            />
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự"
              required
              className="register-form-input"
            />
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              className="register-form-input"
            />
          </div>

          {error ? <p className="register-form-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="register-form-submit">
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản Email'}
          </button>
        </form>
      ) : (
        <div>
          {phoneStep === 'SEND_OTP' ? (
            <form onSubmit={handleSendPhoneOtp} className="register-form-body">
              <div className="register-form-group">
                <label className="register-form-label">Số điện thoại Việt Nam</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                  className="register-form-input"
                />
              </div>

              {error ? <p className="register-form-error">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="register-form-submit">
                {isSubmitting ? 'Đang gửi SMS...' : 'Gửi mã xác thực SMS OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyPhoneOtp} className="register-form-body">
              <div className="register-form-group">
                <label className="register-form-label">Mã 6 chữ số OTP từ SMS ({phone})</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="register-form-input"
                />
              </div>

              {error ? <p className="register-form-error">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="register-form-submit">
                {isSubmitting ? 'Đang xác minh...' : 'Xác nhận OTP & Đăng ký'}
              </button>
            </form>
          )}
        </div>
      )}

      <p className="register-form-footer-note">
        Tài khoản mới sẽ nhận vai trò Mặc định là Thành viên.
      </p>

      <div className="register-form-divider">
        <span className="register-form-divider-line" />
        <span className="register-form-divider-text">HOẶC DÙNG MẠNG XÃ HỘI</span>
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
