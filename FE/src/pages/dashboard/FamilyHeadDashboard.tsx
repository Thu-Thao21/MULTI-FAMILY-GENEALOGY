import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

export const FamilyHeadDashboard: React.FC = () => {
  const { account, logout } = useAuthContext();

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#d97706', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            TRƯỞNG HỌ / ĐẠI DIỆN GIA TỘC (FAMILY HEAD)
          </span>
          <h1 style={{ marginTop: '8px', color: '#0f172a' }}>Khu Vực Quản Lý Gia Tộc</h1>
        </div>
        <button
          onClick={logout}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ background: '#fffbe6', border: '1px solid #fef08a', borderRadius: '16px', padding: '24px' }}>
        <h2>Xin chào Trưởng họ, {account?.display_name || account?.email}!</h2>
        <p>Email: <strong>{account?.email || 'N/A'}</strong></p>
        <p>Vai trò chính: <strong style={{ color: '#d97706' }}>{account?.primary_role}</strong></p>
        <hr style={{ border: 'none', borderTop: '1px solid #fef08a', margin: '20px 0' }} />
        <h3>Chức năng Trưởng Họ:</h3>
        <ul>
          <li>Quản lý Cây Gia phả của Họ tộc</li>
          <li>Thêm/Sửa/Cập nhật thông tin thành viên dòng họ</li>
          <li>Tạo các mối quan hệ liên họ và phả hệ</li>
        </ul>
      </div>
    </div>
  );
};

export default FamilyHeadDashboard;
