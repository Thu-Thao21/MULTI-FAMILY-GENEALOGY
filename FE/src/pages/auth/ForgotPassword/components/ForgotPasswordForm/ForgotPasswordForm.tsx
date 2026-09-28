import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  requestPasswordResetOTP,
  resetPasswordWithOTP,
  sendPhoneOtp,
  setupPhoneRecaptcha,
} from '../../../../../services/auth.service';
import { ROUTES } from '../../../../../config/routes';
import './ForgotPasswordForm.css';

export interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
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
        try {
          if (!recaptchaRef.current) {
            recaptchaRef.current = setupPhoneRecaptcha('forgot-recaptcha');
          }
          const result = await sendPhoneOtp(emailOrPhone, recaptchaRef.current);
          setConfirmationResult(result);
          setOtpTip(`Mã SMS OTP đã được gửi trực tiếp về số điện thoại ${emailOrPhone}. Vui lòng kiểm tra tin nhắn SMS.`);
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

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (confirmationResult && otpCode) {
        await confirmationResult.confirm(otpCode);
      }

      await resetPasswordWithOTP({
        emailOrPhone,
        otp: otpCode,
        newPassword,
      });

      setSuccessMsg('Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Mã OTP không hợp lệ hoặc đặt lại mật khẩu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-form-card">
      <div className="forgot-form-glow-top" />
      <div id="forgot-recaptcha" style={{ display: 'none' }} />

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

      <div className="forgot-form-header">
        <div className="forgot-form-badge">
          <span className="forgot-form-badge-dot" />
          <span className="forgot-form-badge-text">KHÔI PHỤC MẬT KHẨU</span>
        </div>
        <h1 className="forgot-form-title">Quên Mật Khẩu</h1>
      </div>

      {step === 'REQUEST_OTP' ? (
        <form onSubmit={handleRequestOTP} className="forgot-form-body">
          <div className="forgot-form-group">
            <label className="forgot-form-label">Email hoặc Số điện thoại *</label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="VD: nguyenvana@gmail.com hoặc 0912345678"
              required
              className="forgot-form-input"
            />
          </div>

          {error ? <p className="forgot-form-error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
            {isSubmitting ? 'Đang gửi mã OTP...' : 'Gửi Mã Xác Thực OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="forgot-form-body">
          {otpTip && <p className="forgot-form-tip">{otpTip}</p>}

          <div className="forgot-form-group">
            <label className="forgot-form-label">Mã OTP gồm 6 chữ số *</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Nhập 6 chữ số (VD: 123456)"
              required
              className="forgot-form-input"
            />
          </div>

          <div className="forgot-form-group">
            <label className="forgot-form-label">Mật khẩu mới *</label>
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
            <label className="forgot-form-label">Xác nhận mật khẩu mới *</label>
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
          {successMsg ? <p className="forgot-form-success">{successMsg}</p> : null}

          <button type="submit" disabled={isSubmitting} className="forgot-form-submit">
            {isSubmitting ? 'Đang cập nhật...' : 'Cài Đặt Mật Khẩu Mới'}
          </button>
        </form>
      )}

      <div className="forgot-form-switch">
        Nhớ mật khẩu?{' '}
        <button type="button" onClick={onSwitchToLogin} className="btn-switch-link">
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
