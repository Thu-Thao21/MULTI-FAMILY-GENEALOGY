import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

export const MemberDashboard: React.FC = () => {
  const { account, logout, sendVerificationEmail, reloadUserStatus } = useAuthContext();
  const [msg, setMsg] = React.useState('');

  const handleSendVerify = async () => {
    try {
      await sendVerificationEmail();
      setMsg('Đã gửi email xác minh! Vui lòng kiểm tra hộp thư.');
    } catch (e: any) {
      setMsg(e.message || 'Không thể gửi email xác minh.');
    }
  };

  const handleReload = async () => {
    try {
      await reloadUserStatus();
      setMsg('Đã cập nhật trạng thái mới nhất từ hệ thống.');
    } catch (e: any) {
      setMsg(e.message || 'Lỗi cập nhật.');
    }
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ background: '#2563eb', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            THÀNH VIÊN GIA PHẢ (MEMBER)
          </span>
          <h1 style={{ marginTop: '8px', color: '#0f172a' }}>Khu Vực Thành Viên</h1>
        </div>
        <button
          onClick={logout}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '24px' }}>
        <h2>Xin chào, {account?.display_name || account?.email || 'Thành viên'}!</h2>
        <p>Email: <strong>{account?.email || 'Chưa cập nhật'}</strong> {account?.email_verified ? '✅ (Đã xác minh)' : '❌ (Chưa xác minh)'}</p>
        <p>Số điện thoại: <strong>{account?.phone_e164 || 'Chưa cập nhật'}</strong> {account?.phone_verified ? '✅ (Đã xác minh)' : ''}</p>
        <p>Vai trò chính: <strong style={{ color: '#2563eb' }}>{account?.primary_role}</strong></p>

        {!account?.email_verified && (
          <div style={{ marginTop: '16px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #93c5fd' }}>
            <p style={{ margin: '0 0 10px', color: '#1d4ed8', fontWeight: 'bold' }}>Tài khoản chưa được xác minh Email:</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSendVerify} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                Gửi lại Email xác minh
              </button>
              <button onClick={handleReload} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                Cập nhật trạng thái
              </button>
            </div>
            {msg && <p style={{ marginTop: '8px', fontSize: '13px', color: '#047857' }}>{msg}</p>}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #bfdbfe', margin: '20px 0' }} />
        <h3>Chức năng Thành viên:</h3>
        <ul>
          <li>Tra cứu thông tin cây phả hệ dòng họ</li>
          <li>Gửi Yêu cầu cấp quyền Trưởng họ (RoleRequest)</li>
          <li>Cập nhật thông tin cá nhân</li>
        </ul>
      </div>
    </div>
  );
};

export default MemberDashboard;
