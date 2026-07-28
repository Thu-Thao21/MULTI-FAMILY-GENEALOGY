import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đăng ký thành công!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '440px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        padding: '32px',
        boxSizing: 'border-box'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#2563eb', fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px 0', letterSpacing: '1px' }}>HOME</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Tạo tài khoản mới</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Username <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="vd: nguyen_van_a"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #60a5fa',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>Chỉ a-z, 0-9 và dấu _, ít nhất 5 ký tự</p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* Tên hiển thị */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Tên hiển thị
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A (tùy chọn)"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Mật khẩu */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Mật khẩu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ít nhất 8 ký tự"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Xác nhận mật khẩu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#2583be',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            ✓ Đăng ký
          </button>
        </form>

        {/* Divider hoặc */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          margin: '20px 0',
          color: '#9ca3af',
          fontSize: '12px',
          textTransform: 'uppercase'
        }}>
          <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }}></div>
          <span style={{ padding: '0 10px', backgroundColor: '#fff' }}>hoặc</span>
          <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }}></div>
        </div>

        {/* Nút Sign up with Google */}
        <button
          type="button"
          onClick={() => alert('Đăng nhập Google')}
          style={{
            width: '100%',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <svg style={{ width: '18px', height: '18px', fill: '#ffffff' }} viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.2h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.125-3.059C18.017 1.77 15.395 1 12.24 1 6.039 1 1 6.039 1 12.24s5.039 11.24 11.24 11.24c6.485 0 10.785-4.562 10.785-10.985 0-.76-.078-1.341-.171-1.91h-21.36z"/>
          </svg>
          <span>Sign up with Google</span>
        </button>

      </div>
    </div>
  );
}