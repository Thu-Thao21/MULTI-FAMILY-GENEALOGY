import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
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
    <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.22)', padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#2563eb', fontSize: '28px', fontWeight: 800, letterSpacing: '1px' }}>HOME</h1>
        <p style={{ margin: '8px 0 0', color: '#64748b' }}>Tạo tài khoản mới để bắt đầu</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="vd: nguyen_van_a" required style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Email hoặc số điện thoại</label>
          <input type="text" name="emailOrPhone" value={formData.emailOrPhone} onChange={handleChange} placeholder="email@example.com hoặc 0912345678" required style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Tên hiển thị</label>
          <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Mật khẩu</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Ít nhất 8 ký tự" required style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Xác nhận mật khẩu</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" required style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
        </div>

        {error ? <p style={{ margin: 0, color: '#dc2626', fontSize: '13px' }}>{error}</p> : null}

        <button type="submit" disabled={isSubmitting} style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>

      <div style={{ marginTop: '18px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
        Đã có tài khoản?{' '}
        <button type="button" onClick={onSwitchToLogin} style={{ color: '#2563eb', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;