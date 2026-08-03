import React, { useState } from 'react';
import './Header.css';

export interface HeaderProps {
  userName: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onLogout, activeTab, setActiveTab }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: '🏠' },
    { id: 'tree', label: 'Cây Gia Phả', icon: '🌳' },
    { id: 'families', label: 'Dòng Họ', icon: '⛩️' },
    { id: 'network', label: 'Mạng Lưới Liên Kết', icon: '🔗' },
    { id: 'finder', label: 'Tra Cứu Xưng Hô', icon: '✨' },
    { id: 'events', label: 'Sự Kiện Gia Tộc', icon: '📅' },
  ];

  const notifications: Array<{ id: number; text: string; time: string; unread: boolean }> = [];

  return (
    <header className="dashboard-header-container">
      <div className="header-inner-row">
        <div onClick={() => setActiveTab('dashboard')} className="header-brand-box">
          <div className="header-logo-box">🌱</div>
          <div>
            <div className="header-system-tag">HỆ THỐNG GIA PHẢ LIÊN HỌ</div>
            <div className="header-title-text">Gia Phả Việt</div>
          </div>
        </div>

        <nav className="header-nav-bar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`header-nav-btn ${isActive ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="header-right-actions">
          <div className="header-search-wrapper">
            <input
              type="text"
              placeholder="Tìm tên người, dòng họ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            <span className="header-search-icon">🔍</span>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="header-notif-btn"
              title="Thông báo"
            >
              🔔
              {notifications.length > 0 && (
                <span className="header-notif-badge">{notifications.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="header-notif-dropdown">
                <div className="header-notif-top">
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>🔔 Thông báo mới</span>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>
                    Đánh dấu đã đọc
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '16px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      Không có thông báo mới nào.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          backgroundColor: n.unread ? '#eff6ff' : '#f8fafc',
                          borderLeft: n.unread ? '4px solid #2563eb' : 'none',
                          fontSize: '13px',
                        }}
                      >
                        <div style={{ color: '#1e293b', fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="header-user-btn">
              <div className="header-user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Thành viên gia tộc</div>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>▼</span>
            </button>

            {showProfileMenu && (
              <div className="header-profile-menu">
                <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{userName}</div>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Tài khoản đã xác thực</div>
                </div>
                <button className="header-menu-item" onClick={() => alert('Hồ sơ cá nhân')}>
                  <span>👤</span> Hồ sơ cá nhân
                </button>
                <button className="header-menu-item" onClick={() => alert('Cài đặt hệ thống')}>
                  <span>⚙️</span> Cài đặt hệ thống
                </button>
                <div style={{ margin: '4px 0', borderTop: '1px solid #f1f5f9' }} />
                <button onClick={onLogout} className="header-menu-item-logout">
                  <span>🚪</span> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
