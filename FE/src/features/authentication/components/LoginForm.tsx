import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSuccess }) => {
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
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(255,255,255,0.98)',
        border: '1px solid rgba(37, 99, 235, 0.12)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        boxShadow: '0 32px 80px rgba(15, 23, 42, 0.18)',
        padding: '36px 32px 32px',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '16px', right: '16px', width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(59,130,246,0.14)', filter: 'blur(16px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20px', left: '18px', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(37,99,235,0.18)', zIndex: 0 }} />
      <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb' }} />
          <span style={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.18em', fontSize: '12px' }}>ĐĂNG NHẬP NGAY</span>
        </div>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '32px', fontWeight: 800, letterSpacing: '0.3px' }}>Chào mừng bạn trở lại!</h1>
        <p style={{ margin: '16px 0 0', color: '#475569', lineHeight: 1.75 }}>Đăng nhập để tiếp tục khám phá gia phả và kết nối các dòng họ.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Email hoặc số điện thoại</label>
          <input type="text" name="emailOrPhone" value={formData.emailOrPhone} onChange={handleChange} placeholder="email@example.com hoặc 0912345678" required style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.35)', background: '#f8fafc', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.05)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Mật khẩu</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu" required style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1px solid rgba(148, 163, 184, 0.35)', background: '#f8fafc', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.05)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }} />
        </div>

        {error ? <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>{error}</p> : null}

        <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', borderRadius: '16px', padding: '14px 16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 16px 28px rgba(37, 99, 235, 0.24)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>An toàn với mã hóa, xác thực nhanh và bộ nhớ phiên ổn định.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>HOẶC</span>
          <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#ffffff', color: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: '16px', padding: '12px 16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#f8fafc', color: '#1a73e8', fontWeight: 700 }}>G</span>
            <span style={{ fontWeight: 700 }}>Google</span>
          </button>
          <button type="button" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#1d4ed8', color: '#ffffff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '16px', padding: '12px 16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(29, 78, 216, 0.16)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', color: '#ffffff', fontWeight: 700 }}>F</span>
            <span style={{ fontWeight: 700 }}>Facebook</span>
          </button>
        </div>
      </form>

      <div style={{ marginTop: '18px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
        Chưa có tài khoản?{' '}
        <button type="button" onClick={onSwitchToRegister} style={{ color: '#2563eb', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
