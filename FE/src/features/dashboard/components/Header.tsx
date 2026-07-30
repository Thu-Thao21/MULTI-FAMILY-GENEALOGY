import React, { useState } from 'react';

interface HeaderProps {
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

  const notifications = [
    { id: 1, text: 'Họ Trần vừa thêm thành viên mới: Trần Văn Nam', time: '10 phút trước', unread: true },
    { id: 2, text: 'Sắp đến ngày Giỗ Tổ Họ Nguyễn (10/08)', time: '2 giờ trước', unread: true },
    { id: 3, text: 'Liên kết hôn nhân mới: Nguyễn Văn A 💖 Lê Thị B', time: '1 ngày trước', unread: false },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '24px',
              boxShadow: '0 10px 22px rgba(37, 99, 235, 0.25)',
            }}
          >
            🌱
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#2563eb',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              HỆ THỐNG GIA PHẢ LIÊN HỌ
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.1,
              }}
            >
              Gia Phả Việt
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#f1f5f9',
            padding: '5px',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#2563eb' : '#64748b',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.06)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Quick Search */}
          <div style={{ position: 'relative', width: '230px' }}>
            <input
              type="text"
              placeholder="Tìm tên người, dòng họ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 38px',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '13.5px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '15px',
                color: '#94a3b8',
              }}
            >
              🔍
            </span>
          </div>

          {/* Notifications button */}
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
                fontSize: '19px',
                boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
              }}
              title="Thông báo"
            >
              🔔
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '19px',
                  height: '19px',
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

            {/* Notifications Modal */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '54px',
                  width: '340px',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)',
                  border: '1px solid #e2e8f0',
                  padding: '18px',
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>🔔 Thông báo mới</span>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>
                    Đánh dấu đã đọc
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map((n) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 14px 6px 6px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Thành viên gia tộc</div>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>▼</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '56px',
                  width: '210px',
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
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Tài khoản đã xác thực</div>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onClick={() => alert('Hồ sơ cá nhân')}
                >
                  <span>👤</span> Hồ sơ cá nhân
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onClick={() => alert('Cài đặt hệ thống')}
                >
                  <span>⚙️</span> Cài đặt hệ thống
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
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
