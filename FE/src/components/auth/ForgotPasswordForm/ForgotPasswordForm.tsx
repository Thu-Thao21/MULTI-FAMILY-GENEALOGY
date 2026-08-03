import React, { useState, useRef } from 'react';
import {
  sendPasswordResetLink,
  sendPhoneOtp,
  verifyPhoneOtp,
  setupPhoneRecaptcha,
} from '../../../services/auth.service';
import './ForgotPasswordForm.css';

export interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [resetMethod, setResetMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [phoneStep, setPhoneStep] = useState<'SEND_OTP' | 'VERIFY_OTP'>('SEND_OTP');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<any>(null);

  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await sendPasswordResetLink(email);
      setSuccessMsg(
        'Nếu email tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi đến hòm thư của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác/spam).'
      );
    } catch (err: any) {
      setError(err.message || 'Không thể gửi liên kết khôi phục mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupPhoneRecaptcha('forgot-recaptcha');
      }
      const result = await sendPhoneOtp(phone, recaptchaRef.current);
      setConfirmationResult(result);
      setPhoneStep('VERIFY_OTP');
      setSuccessMsg(`Mã SMS OTP đã được gửi về số điện thoại ${phone}. Vui lòng nhập mã bên dưới.`);
    } catch (err: any) {
      setError(err.message || 'Không thể gửi mã SMS OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (!confirmationResult) {
        throw new Error('Chưa gửi mã OTP. Vui lòng thử lại.');
      }
      await verifyPhoneOtp(confirmationResult, otpCode);
      setSuccessMsg('Xác thực số điện thoại thành công! Đang chuyển hướng...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Mã OTP không chính xác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-form-card">
      <div className="forgot-form-glow-top" />

      <div className="forgot-form-header">
        <div className="forgot-form-badge">
          <span className="forgot-form-badge-dot" />
          <span className="forgot-form-badge-text">KHÔI PHỦC MẬT KHẨU</span>
        </div>
        <h1 className="forgot-form-title">Quên mật khẩu?</h1>
        <p className="forgot-form-subtitle">
          Vui lòng chọn phương thức khôi phục mật khẩu để tiếp tục.
        </p>
      </div>

      <div id="forgot-recaptcha"></div>

      {/* Tabs Method Selection */}
      <div className="forgot-method-tabs">
        <button
          type="button"
          className={`forgot-tab-btn ${resetMethod === 'EMAIL' ? 'active' : ''}`}
          onClick={() => {
            setResetMethod('EMAIL');
            setError('');
            setSuccessMsg('');
          }}
        >
          Khôi phục qua Email
        </button>
        <button
          type="button"
          className={`forgot-tab-btn ${resetMethod === 'PHONE' ? 'active' : ''}`}
          onClick={() => {
            setResetMethod('PHONE');
            setError('');
            setSuccessMsg('');
          }}
        >
          Xác thực qua SĐT (SMS)
        </button>
      </div>

      {resetMethod === 'EMAIL' ? (
        <form onSubmit={handleEmailReset} className="forgot-form-body">
          <div className="forgot-form-group">
            <label className="forgot-form-label">Email tài khoản</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="forgot-form-input"
            />
          </div>

          {error ? <p className="forgot-form-error">{error}</p> : null}
          {successMsg ? <p className="forgot-form-success">✅ {successMsg}</p> : null}

          <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
            {isSubmitting ? 'Đang gửi liên kết...' : 'Gửi liên kết đặt lại mật khẩu'}
          </button>
        </form>
      ) : (
        <div>
          {phoneStep === 'SEND_OTP' ? (
            <form onSubmit={handleSendPhoneOtp} className="forgot-form-body">
              <div className="forgot-form-group">
                <label className="forgot-form-label">Số điện thoại Việt Nam</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                  className="forgot-form-input"
                />
              </div>

              {error ? <p className="forgot-form-error">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
                {isSubmitting ? 'Đang gửi SMS...' : 'Gửi mã xác thực SMS OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyPhoneOtp} className="forgot-form-body">
              {successMsg ? <p className="forgot-form-success">📲 {successMsg}</p> : null}

              <div className="forgot-form-group">
                <label className="forgot-form-label">Nhập 6 chữ số OTP từ SMS</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="forgot-form-input"
                />
              </div>

              {error ? <p className="forgot-form-error">{error}</p> : null}

              <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
                {isSubmitting ? 'Đang xác minh...' : 'Xác thực OTP & Đăng nhập'}
              </button>
            </form>
          )}
        </div>
      )}

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
