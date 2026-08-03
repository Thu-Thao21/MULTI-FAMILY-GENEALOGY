import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { primaryRole } = useAuthContext();

  const handleReturn = () => {
    if (primaryRole === 'admin') navigate('/admin');
    else if (primaryRole === 'family_head') navigate('/family-head');
    else navigate('/member');
  };

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '72px', color: '#dc2626', margin: '0' }}>403</h1>
      <h2 style={{ color: '#0f172a', margin: '16px 0 8px' }}>Truy Cập Bị Từ Chối (Forbidden)</h2>
      <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 24px' }}>
        Tài khoản của bạn không có quyền truy cập vào tài nguyên này. Vui lòng quay lại khu vực dành cho vai trò của bạn.
      </p>
      <button
        onClick={handleReturn}
        style={{
          background: '#2563eb',
          color: '#ffffff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Quay về Dashboard chính
      </button>
    </div>
  );
};

export default ForbiddenPage;
