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

  const notifications = [
    {
      id: 1,
      title: 'Nhắc ngày giỗ sắp tới',
      desc: 'Giỗ Tổ Họ Nguyễn (Đời 1) còn 3 ngày (10/08/2026)',
      time: '10 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: 'Yêu cầu duyệt thành viên mới',
      desc: 'Trần Văn Nam vừa đăng ký thêm vào cây gia phả Họ Trần',
      time: '1 giờ trước',
      unread: true,
    },
    {
      id: 3,
      title: 'Yêu cầu liên kết dòng họ',
      desc: 'Họ Lê đề xuất tạo kết nối hôn nhân (Họ Nguyễn 💖 Họ Lê)',
      time: '5 giờ trước',
      unread: false,
    },
  ];

  return (
    <header className="topbar-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="topbar-toggle-btn"
          title={isSidebarCollapsed ? 'Mở rộng Menu' : 'Thu gọn Menu'}
        >
          {isSidebarCollapsed ? '☰' : '◀'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '22px',
              boxShadow: '0 8px 18px rgba(37, 99, 235, 0.25)',
            }}
          >
            🌱
          </div>
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#2563eb', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              HỆ THỐNG GIA PHẢ LIÊN HỌ
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.1 }}>
              Gia Phả Việt
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '480px', margin: '0 24px', position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm nhanh tên thành viên, biệt hiệu, dòng họ hoặc ngày giỗ..."
          className="topbar-search-input"
        />
        <span
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            }}
            title="Trung tâm thông báo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff',
              }}
            >
              2
            </span>
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
                {notifications.map((item) => (
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
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 14px 6px 6px',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {userName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: userRole === 'Admin' ? '#fef2f2' : userRole === 'Trưởng họ' ? '#fefce8' : '#eff6ff',
                    color: userRole === 'Admin' ? '#ef4444' : userRole === 'Trưởng họ' ? '#ca8a04' : '#2563eb',
                  }}
                >
                  {userRole}
                </span>
              </div>
            </div>

            <span style={{ fontSize: '11px', color: '#94a3b8' }}>▼</span>
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '58px',
                width: '220px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)',
                border: '1px solid #e2e8f0',
                padding: '8px',
                zIndex: 200,
              }}
            >
              <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>{userRole} • Họ Nguyễn</div>
              </div>

              <button
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => alert('Hồ sơ cá nhân')}
              >
                Hồ sơ cá nhân
              </button>

              <button
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => alert('Cài đặt tài khoản')}
              >
                Cài đặt tài khoản
              </button>

              <div style={{ margin: '4px 0', borderTop: '1px solid #f1f5f9' }} />

              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#fef2f2',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
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
