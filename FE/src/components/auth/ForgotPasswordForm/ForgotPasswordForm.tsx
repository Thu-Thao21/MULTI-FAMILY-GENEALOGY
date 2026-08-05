import React, { useState, useRef } from 'react';
import {
  requestPasswordResetOTP,
  resetPasswordWithOTP,
  sendPhoneOtp,
  setupPhoneRecaptcha,
} from '../../../services/auth.service';
import './ForgotPasswordForm.css';

export interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<'REQUEST_OTP' | 'VERIFY_AND_RESET'>('REQUEST_OTP');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpTip, setOtpTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaRef = useRef<any>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const isEmail = emailOrPhone.includes('@');

    try {
      if (isEmail) {
        const res = await requestPasswordResetOTP(emailOrPhone);
        setOtpTip(res.message);
      } else {
        // Direct Firebase SMS OTP sending to mobile phone with smart fallback
        try {
          if (!recaptchaRef.current) {
            recaptchaRef.current = setupPhoneRecaptcha('forgot-recaptcha');
          }
          const result = await sendPhoneOtp(emailOrPhone, recaptchaRef.current);
          setConfirmationResult(result);
          setOtpTip(` Mã SMS OTP đã được gửi trực tiếp về số điện thoại ${emailOrPhone}. Vui lòng kiểm tra tin nhắn SMS.`);
        } catch (fbErr: any) {
          console.warn('Firebase SMS Error/Billing restriction, falling back to Backend OTP:', fbErr);
          const res = await requestPasswordResetOTP(emailOrPhone);
          setOtpTip(res.message);
        }
      }
      setStep('VERIFY_AND_RESET');
    } catch (err: any) {
      setError(err.message || 'Không thể gửi mã OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const isEmail = emailOrPhone.includes('@');

    try {
      if (!isEmail && confirmationResult) {
        try {
          await confirmationResult.confirm(otpCode.trim());
        } catch (confirmErr) {
          console.warn('Firebase confirmation skipped, verifying via Backend OTP:', confirmErr);
        }
      }
      const res = await resetPasswordWithOTP(emailOrPhone, otpCode, newPassword, confirmPassword);
      setSuccessMsg(res.message);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Đặt lại mật khẩu thất bại.');
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
        <h1 className="forgot-form-title">
          {step === 'REQUEST_OTP' ? 'Quên mật khẩu?' : 'Nhập mã OTP & Mật khẩu mới'}
        </h1>
        <p className="forgot-form-subtitle">
          {step === 'REQUEST_OTP'
            ? 'Nhập email hoặc số điện thoại tài khoản để nhận mã xác thực OTP.'
            : `Nhập mã OTP vừa được gửi về ${emailOrPhone} và cài đặt mật khẩu mới.`}
        </p>
      </div>

      <div id="forgot-recaptcha"></div>

      {step === 'REQUEST_OTP' ? (
        <form onSubmit={handleRequestOTP} className="forgot-form-body">
          <div className="forgot-form-group">
            <label className="forgot-form-label">Email hoặc số điện thoại</label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="email@example.com hoặc 0912345678"
              required
              className="forgot-form-input"
            />
          </div>

          {error ? <p className="forgot-form-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
            {isSubmitting ? 'Đang gửi mã OTP...' : 'Gửi mã OTP xác thực'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="forgot-form-body">
          {otpTip ? <p className="forgot-form-otp-tip"> {otpTip}</p> : null}

          <div className="forgot-form-group">
            <label className="forgot-form-label">Mã OTP xác thực (6 chữ số)</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Nhập 6 chữ số OTP từ email"

              required
              className="forgot-form-input"
            />
          </div>

          <div className="forgot-form-group">
            <label className="forgot-form-label">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự"
              required
              className="forgot-form-input"
            />
          </div>

          <div className="forgot-form-group">
            <label className="forgot-form-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
              className="forgot-form-input"
            />
          </div>

          {error ? <p className="forgot-form-error">{error}</p> : null}
          {successMsg ? <p className="forgot-form-success"> {successMsg}</p> : null}

          <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
            {isSubmitting ? 'Đang đặt lại...' : 'Xác nhận đặt lại mật khẩu'}
          </button>
        </form>
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
