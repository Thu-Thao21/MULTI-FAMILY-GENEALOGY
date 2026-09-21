import React, { useState } from 'react';
import { useToast } from '../../common/Toast';
import './AccountSettings.css';

export interface AccountSettingsProps {
  userName?: string;
  userRole?: string;
  onBack?: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  userName = 'Quản Trị Viên (Demo)',
  userRole = 'Admin',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('security');
  const [settings, setSettings] = useState({
    twoFactor: true,
    emailNotif: true,
    pushNotif: true,
    weeklyReport: false,
    darkMode: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome trên Windows 11', location: 'Hà Nội, Việt Nam', isCurrent: true, lastActive: 'Đang hoạt động' },
    { id: 'sess-2', device: 'Safari trên iPhone 15 Pro', location: 'Hà Nội, Việt Nam', isCurrent: false, lastActive: '2 giờ trước' },
  ]);

  const toast = useToast();

  const toggleSetting = (key: keyof typeof settings) => {
    const nextVal = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: nextVal }));
    toast.success('Cập nhật cài đặt', `Đã ${nextVal ? 'bật' : 'tắt'} tùy chọn thành công.`);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Thiếu thông tin', 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Lỗi mật khẩu', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    toast.success('Cập nhật thành công', 'Mật khẩu tài khoản của bạn đã được đổi.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.warning('Đã thu hồi phiên', 'Thiết bị đã được đăng xuất khỏi tài khoản của bạn.');
  };

  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="settings-title">Cài Đặt Tài Khoản</h1>
            <p className="settings-subtitle">Quản lý bảo mật, thông báo và tùy chọn hệ thống của bạn ({userName} • {userRole})</p>
          </div>
          {onBack && (
            <button className="btn-cancel" onClick={onBack}>
              ← Quay lại
            </button>
          )}
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Bảo mật & Đăng nhập
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Thông báo
          </button>
          <button 
            className={`settings-tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            Thiết bị đăng nhập
          </button>
          <button 
            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Tùy chọn hiển thị
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Đổi mật khẩu</h3>
              <p className="settings-desc">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>
              
              <form onSubmit={handleUpdatePassword} className="settings-form">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    placeholder="Nhập mật khẩu hiện tại" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input 
                    type="password" 
                    placeholder="Nhập mật khẩu mới" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu mới" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary mt-2">Cập nhật mật khẩu</button>
              </form>

              <hr className="settings-divider" />

              <h3>Xác thực 2 bước (2FA)</h3>
              <p className="settings-desc">Tăng cường bảo mật bằng cách yêu cầu mã OTP khi đăng nhập.</p>
              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Bật xác thực 2 bước (Google Authenticator)</div>
                  <div className="toggle-sub">Bảo vệ tài khoản an toàn tuyệt đối khỏi nguy cơ đánh cắp mật khẩu.</div>
                </div>
                <div className={`toggle-switch ${settings.twoFactor ? 'on' : ''}`} onClick={() => toggleSetting('twoFactor')}>
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Quản lý thông báo</h3>
              <p className="settings-desc">Tùy chỉnh các kênh nhận tin tức và thông báo từ hệ thống.</p>
              
              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Thông báo qua Email</div>
                  <div className="toggle-sub">Nhận thông tin quan trọng về các đề xuất và phê duyệt.</div>
                </div>
                <div className={`toggle-switch ${settings.emailNotif ? 'on' : ''}`} onClick={() => toggleSetting('emailNotif')}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Thông báo đẩy (Push Notifications)</div>
                  <div className="toggle-sub">Nhận thông báo trực tiếp trên trình duyệt khi có sự kiện mới.</div>
                </div>
                <div className={`toggle-switch ${settings.pushNotif ? 'on' : ''}`} onClick={() => toggleSetting('pushNotif')}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Báo cáo tổng hợp hàng tuần</div>
                  <div className="toggle-sub">Gửi báo cáo tóm tắt các hoạt động hệ thống vào sáng thứ Hai.</div>
                </div>
                <div className={`toggle-switch ${settings.weeklyReport ? 'on' : ''}`} onClick={() => toggleSetting('weeklyReport')}>
                  <div className="toggle-knob"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="settings-section">
              <h3>Thiết bị & Phiên làm việc</h3>
              <p className="settings-desc">Danh sách các thiết bị đang đăng nhập vào tài khoản của bạn.</p>
              
              <div className="settings-sessions-list" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                {activeSessions.map((sess) => (
                  <div key={sess.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '14px 18px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {sess.device}
                        {sess.isCurrent && (
                          <span style={{ fontSize: 11, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 999 }}>Thiết bị này</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sess.location} • {sess.lastActive}</div>
                    </div>
                    {!sess.isCurrent && (
                      <button 
                        style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => handleRevokeSession(sess.id)}
                      >
                        Đăng xuất
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h3>Tùy chọn giao diện</h3>
              <p className="settings-desc">Tùy chỉnh phong cách hiển thị của hệ thống.</p>
              
              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-label">Giao diện ban đêm (Dark Mode)</div>
                  <div className="toggle-sub">Chuyển sang nền tối để dịu mắt khi sử dụng vào ban đêm.</div>
                </div>
                <div className={`toggle-switch ${settings.darkMode ? 'on' : ''}`} onClick={() => toggleSetting('darkMode')}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <hr className="settings-divider" />

              <h3>Ngôn ngữ hiển thị</h3>
              <div className="form-group" style={{ maxWidth: 300, marginTop: 8 }}>
                <select className="settings-select">
                  <option value="vi">Tiếng Việt (Mặc định)</option>
                  <option value="en">English (Quốc tế)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
