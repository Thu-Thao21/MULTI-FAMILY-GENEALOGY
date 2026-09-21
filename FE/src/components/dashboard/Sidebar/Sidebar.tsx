import React, { useState } from 'react';
import './Sidebar.css';

export interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  userRole = 'Thành viên',
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    overview: true,
    tree_rel: true,
    network: true,
    profile_prop: true,
    life: true,
    docs_ai: true,
    settings: true,
    admin: true,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isAdmin = (userRole || '').toLowerCase() === 'admin';

  const memberGroups = [
    {
      id: 'overview',
      label: 'TỔNG QUAN',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      items: [
        { id: 'dashboard', label: 'Trang chủ' },
        { id: 'notifications', label: 'Thông báo cá nhân' },
      ],
    },
    {
      id: 'tree_rel',
      label: 'GIA PHẢ & QUAN HỆ',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      items: [
        { id: 'tree', label: 'Cây Gia Phả' },
        { id: 'member-list', label: 'Danh sách thành viên' },
        { id: 'relationship-finder', label: 'Tra cứu & Xưng hô' },
      ],
    },
    {
      id: 'network',
      label: 'MẠNG LƯỚI LIÊN HỌ',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      items: [
        { id: 'net-noi', label: 'Dòng họ Nội' },
        { id: 'net-ngoai', label: 'Dòng họ Ngoại' },
        { id: 'net-dau-re', label: 'Dâu & Rể liên họ' },
        { id: 'net-thong-gia', label: 'Họ Thông gia' },
      ],
    },
    {
      id: 'profile_prop',
      label: 'HỒ SƠ & ĐỀ XUẤT',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      items: [
        { id: 'my-profile', label: 'Hồ sơ của tôi' },
        { id: 'my-proposals', label: 'Đề xuất của tôi' },
      ],
    },
    {
      id: 'life',
      label: 'ĐỜI SỐNG DÒNG HỌ',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      items: [
        { id: 'anniversaries', label: 'Lịch ngày giỗ' },
        { id: 'events', label: 'Sự kiện dòng họ' },
        { id: 'funds', label: 'Quỹ & Đóng góp' },
        { id: 'ancestral-hall', label: 'Phòng thờ số' },
      ],
    },
    {
      id: 'docs_ai',
      label: 'TƯ LIỆU & AI',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      items: [
        { id: 'documents', label: 'Tư liệu lịch sử' },
        { id: 'ai-assistant', label: 'Trợ lý AI dòng họ' },
      ],
    },
    {
      id: 'settings',
      label: 'CÀI ĐẶT & BẢO MẬT',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      items: [
        { id: 'privacy-settings', label: 'Quyền riêng tư' },
      ],
    },
  ];

  const adminGroups = [
    {
      id: 'admin_dash',
      label: 'TRANG CHỦ ADMIN',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      items: [{ id: 'dashboard', label: 'Dashboard Admin' }],
    },
    {
      id: 'admin_mgmt',
      label: 'QUẢN TRỊ HỆ THỐNG',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      items: [
        { id: 'admin-permissions', label: 'Phân quyền tài khoản' },
        { id: 'admin-families-mgmt', label: 'Quản lý dòng họ' },
        { id: 'admin-members-mgmt', label: 'Quản lý thành viên' },
        { id: 'admin-family-links', label: 'Liên kết dòng họ' },
        { id: 'admin-approval', label: 'Phê duyệt đề xuất' },
        { id: 'admin-logs', label: 'Nhật ký hệ thống' },
        { id: 'admin-data-backup', label: 'Sao lưu & Khôi phục' },
      ],
    },
  ];

  const menuGroups = isAdmin ? adminGroups : memberGroups;

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {!isCollapsed && (
        <div className="sidebar-section-title">
          {isAdmin ? 'HỆ THỐNG QUẢN TRỊ' : 'DANH MỤC DÒNG HỌ'}
        </div>
      )}

      {menuGroups.map((group) => {
        const isGroupActive = group.items.some((item) => item.id === activeTab);
        const isExpanded = expandedGroups[group.id] !== false;

        return (
          <div key={group.id} className="sidebar-group-wrapper">
            <button
              onClick={() => toggleGroup(group.id)}
              className={`sidebar-group-btn ${isCollapsed ? 'collapsed' : 'expanded'} ${
                isGroupActive ? 'active' : ''
              }`}
              title={isCollapsed ? group.label : undefined}
            >
              <div className="sidebar-group-left">
                <span className="sidebar-group-icon">{group.icon}</span>
                {!isCollapsed && <span className="sidebar-group-label">{group.label}</span>}
              </div>

              {!isCollapsed && (
                <div className="sidebar-group-right">
                  <span className={`sidebar-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
                </div>
              )}
            </button>

            {!isCollapsed && isExpanded && (
              <div className="sidebar-subitem-list">
                {group.items.map((subItem) => {
                  const isSubActive = activeTab === subItem.id;
                  return (
                    <button
                      key={subItem.id}
                      onClick={() => onSelectTab(subItem.id)}
                      className={`sidebar-subitem-btn ${isSubActive ? 'active' : ''}`}
                    >
                      {subItem.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
