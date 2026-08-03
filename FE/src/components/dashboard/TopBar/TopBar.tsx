import React, { useState } from 'react';
import './TopBar.css';

export interface TopBarProps {
  userName: string;
  userRole?: string;
  onLogout: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userName,
  userRole = 'Trưởng họ',
  onLogout,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications: Array<{ id: number; title: string; desc: string; time: string; unread: boolean }> = [];

  const roleClass =
    userRole === 'Admin' ? 'admin' : userRole === 'Trưởng họ' ? 'head' : 'member';

  return (
    <header className="topbar-header">
      <div className="topbar-left-group">
        <button
          onClick={onToggleSidebar}
          className="topbar-toggle-btn"
          title={isSidebarCollapsed ? 'Mở rộng Menu' : 'Thu gọn Menu'}
        >
          {isSidebarCollapsed ? '☰' : '◀'}
        </button>

        <div className="topbar-brand-box">
          <div className="topbar-logo-icon">🌱</div>
          <div>
            <div className="topbar-system-tag">HỆ THỐNG GIA PHẢ LIÊN HỌ</div>
            <div className="topbar-brand-title">Gia Phả Việt</div>
          </div>
        </div>
      </div>

      <div className="topbar-search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm nhanh tên thành viên, biệt hiệu, dòng họ hoặc ngày giỗ..."
          className="topbar-search-input"
        />
        <span className="topbar-search-icon-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>

      <div className="topbar-right-group">
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-notif-btn"
            title="Trung tâm thông báo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications.length > 0 && (
              <span className="topbar-notif-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '56px',
                width: '360px',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)',
                border: '1px solid #e2e8f0',
                padding: '20px',
                zIndex: 200,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Trung Tâm Thông Báo
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>
                  Đánh dấu đã đọc
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    Không có thông báo mới nào.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        backgroundColor: item.unread ? '#eff6ff' : '#f8fafc',
                        borderLeft: item.unread ? '4px solid #2563eb' : 'none',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: 1.4 }}>{item.desc}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{item.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="topbar-user-btn">
            <div className="topbar-user-avatar">{userName.charAt(0).toUpperCase()}</div>

            <div style={{ textAlign: 'left' }}>
              <div className="topbar-user-name">{userName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span className={`topbar-user-role-badge ${roleClass}`}>{userRole}</span>
              </div>
            </div>

            <span style={{ fontSize: '11px', color: '#94a3b8' }}>▼</span>
          </button>

          {showProfileMenu && (
            <div className="topbar-profile-dropdown">
              <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>{userRole}</div>
              </div>

              <button className="topbar-menu-item" onClick={() => alert('Hồ sơ cá nhân')}>
                Hồ sơ cá nhân
              </button>

              <button className="topbar-menu-item" onClick={() => alert('Cài đặt tài khoản')}>
                Cài đặt tài khoản
              </button>

              <div style={{ margin: '4px 0', borderTop: '1px solid #f1f5f9' }} />

              <button onClick={onLogout} className="topbar-menu-item-logout">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
