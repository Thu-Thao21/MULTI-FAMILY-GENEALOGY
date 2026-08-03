import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { account, logout } = useAuthContext();

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#dc2626', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN)
          </span>
          <h1 style={{ marginTop: '8px', color: '#0f172a' }}>Khu Vực Quản Trị Hệ Thống Gia Phả</h1>
        </div>
        <button
          onClick={logout}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <h2>Xin chào, {account?.display_name || account?.email || 'Admin'}!</h2>
        <p>Email: <strong>{account?.email || 'N/A'}</strong></p>
        <p>Firebase UID: <code>{account?.firebase_uid}</code></p>
        <p>Vai trò chính: <strong style={{ color: '#dc2626' }}>{account?.primary_role}</strong></p>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
        <h3>Chức năng Quản trị viên:</h3>
        <ul>
          <li>Phê duyệt Yêu cầu cấp quyền Trưởng họ (`RoleRequest`)</li>
          <li>Quản lý Danh sách Gia tộc và Thành viên</li>
          <li>Cấu hình Hệ thống và Phân quyền API</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
