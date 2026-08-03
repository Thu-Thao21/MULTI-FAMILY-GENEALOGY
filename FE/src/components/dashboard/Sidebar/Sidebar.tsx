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
  userRole = 'Trưởng họ',
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    tree: true,
    network: true,
    members: false,
    finder: false,
    reports: false,
    admin: false,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isAdminOrLeader = userRole === 'Admin' || userRole === 'Trưởng họ';

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'Trang chủ',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      singleTab: 'dashboard',
    },
    {
      id: 'tree',
      label: 'Cây Gia Phả',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      badge: 'Trực quan',
      items: [
        { id: 'tree-vertical', label: 'Sơ đồ đứng (Vertical)' },
        { id: 'tree-horizontal', label: 'Sơ đồ ngang (Horizontal)' },
        { id: 'tree-focus', label: 'Chế độ Tập trung (Focus View)' },
      ],
    },
    {
      id: 'network',
      label: 'Mạng lưới Liên họ',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      badge: 'Mạng lưới',
      items: [
        { id: 'net-noi', label: 'Dòng họ Nội' },
        { id: 'net-ngoai', label: 'Dòng họ Ngoại' },
        { id: 'net-dau-re', label: 'Dâu & Rể liên họ' },
        { id: 'net-thong-gia', label: 'Họ Thông gia' },
      ],
    },
    {
      id: 'members',
      label: 'Hồ sơ & Thành viên',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      items: [
        { id: 'member-list', label: 'Danh sách thành viên' },
        { id: 'member-add', label: 'Thêm thành viên mới' },
        { id: 'member-profile', label: 'Hồ sơ cá nhân gia tộc' },
      ],
    },
    {
      id: 'finder',
      label: 'Tra cứu & Xưng hô',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      items: [
        { id: 'finder-auto', label: 'Tính quan hệ/xưng hô tự động' },
        { id: 'finder-path', label: 'Tìm đường đi quan hệ' },
      ],
    },
    {
      id: 'reports',
      label: 'Báo cáo & Xuất nhập',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      items: [
        { id: 'export-pdf', label: 'Xuất PDF / Sơ đồ PNG' },
        { id: 'export-excel', label: 'Xuất danh sách Excel' },
        { id: 'import-data', label: 'Nhập dữ liệu gia phả' },
      ],
    },
  ];

  if (isAdminOrLeader) {
    menuGroups.push({
      id: 'admin',
      label: 'Quản trị hệ thống',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      badge: userRole,
      items: [
        { id: 'admin-role-requests', label: '⭐ Phê duyệt quyền Trưởng Họ' },
        { id: 'admin-permissions', label: 'Phân quyền thành viên' },
        { id: 'admin-approval', label: 'Phê duyệt chỉnh sửa' },
        { id: 'admin-logs', label: 'Lịch sử thay đổi gia phả' },
      ],
    });
  }

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {!isCollapsed && <div className="sidebar-section-title">QUẢN LÝ GIA PHẢ</div>}

      {menuGroups.map((group) => {
        const isSingle = Boolean(group.singleTab);
        const isGroupActive = isSingle
          ? activeTab === group.singleTab
          : group.items?.some((item) => item.id === activeTab);
        const isExpanded = expandedGroups[group.id];

        return (
          <div key={group.id} className="sidebar-group-wrapper">
            <button
              onClick={() => {
                if (isSingle) {
                  onSelectTab(group.singleTab!);
                } else {
                  toggleGroup(group.id);
                }
              }}
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
                  {group.badge && (
                    <span className={`sidebar-badge ${group.id === 'admin' ? 'admin-badge' : ''}`}>
                      {group.badge}
                    </span>
                  )}
                  {!isSingle && (
                    <span className={`sidebar-arrow ${isExpanded ? 'open' : ''}`}>▼</span>
                  )}
                </div>
              )}
            </button>

            {!isCollapsed && !isSingle && isExpanded && group.items && (
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
