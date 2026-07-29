import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      await login({ email: formData.email, password: formData.password });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.22)', padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#2563eb', fontSize: '28px', fontWeight: 800, letterSpacing: '1px' }}>HOME</h1>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Đăng nhập để tiếp tục vào hệ thống gia phả</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Mật khẩu</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu" required style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        {error ? <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>{error}</p> : null}

        <button type="submit" disabled={isSubmitting} style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
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
