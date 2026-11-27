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
    worship_space: true,
    life: true,
    docs_ai: true,
    governance: true,
    profile_settings: true,
    admin: true,
    tree_network: true,
    worship_life: true,
    heritage_settings: true,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isAdmin = (userRole || '').toLowerCase() === 'admin';
  const roleLower = (userRole || '').toLowerCase();
  const isClanAdmin = ['trưởng tộc', 'chủ dòng họ', 'clan admin', 'clan_admin', 'family_head'].includes(roleLower);
  const isFamilyAdmin = ['family admin', 'family_admin', 'manager'].includes(roleLower);
  const canManageFamily = isClanAdmin || isFamilyAdmin;

  // 1. Menu dành cho Quản trị viên hệ thống (Admin) - Hoàn toàn không chứa icon, chỉ hiển thị nhãn chức năng
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'admin-permissions', label: 'Quản Lý Tài Khoản' },
    { id: 'admin-approval', label: 'Phê duyệt' },
    { id: 'admin-packages', label: 'Gói Dịch Vụ' },
    { id: 'admin-payments', label: 'Thanh Toán' },
    { id: 'admin-moderation', label: 'Kiểm Duyệt' },
    { id: 'admin-roles', label: 'Phân Quyền & Role' },
    { id: 'admin-logs', label: 'Nhật Ký Hệ Thống' },
    { id: 'admin-data-backup', label: 'Sao Lưu & Khôi Phục' },
  ];

  // 2. Menu Tổng thể thống nhất cho toàn bộ hệ thống Gia phả (Chỉ 1 thanh sidebar tổng)
  const unifiedGroups = [
    {
      id: 'overview',
      label: 'TỔNG QUAN',
      items: [
        { id: 'dashboard', label: 'Trang chủ' },
        { id: 'notifications', label: 'Thông báo & Nhắc nhở' },
      ],
    },
    // Nhóm Điều hành & Phê duyệt dành cho Trưởng tộc / Quản trị dòng họ
    ...(canManageFamily
      ? [
          {
            id: 'governance',
            label: 'ĐIỀU HÀNH & PHÊ DUYỆT',
            items: [
              { id: 'family-approvals', label: 'Phê duyệt đề xuất & Gia nhập' },
              { id: 'family-accounts', label: 'Quản lý & Phân quyền' },
              { id: 'family-links', label: 'Quản lý Liên họ (Thông gia)' },
              { id: 'family-import-export', label: 'Nhập xuất Excel gia phả' },
              { id: 'family-logs', label: 'Nhật ký hoạt động' },
            ],
          },
        ]
      : []),
    {
      id: 'tree_rel',
      label: 'GIA PHẢ & THÀNH VIÊN',
      items: [
        { id: 'tree', label: 'Cây Gia Phả' },
        { id: 'member-list', label: 'Danh sách thành viên' },
        { id: 'relationship-finder', label: 'Tra cứu & Xưng hô' },
      ],
    },
    {
      id: 'network',
      label: 'MẠNG LƯỚI LIÊN HỌ',
      items: [
        { id: 'net-dau-re', label: 'Dâu & Rể liên họ' },
        { id: 'net-ngoai', label: 'Dòng họ liên kết' },
      ],
    },
    {
      id: 'worship_space',
      label: 'THỜ CÚNG & ĐỊA ĐIỂM',
      items: [
        { id: 'ancestral-hall', label: 'Phòng thờ số (3D)' },
        { id: 'clan-locations', label: 'Bản đồ & Địa điểm dòng họ' },
      ],
    },
    {
      id: 'life',
      label: 'ĐỜI SỐNG DÒNG HỌ',
      items: [
        { id: 'events', label: 'Sự kiện & Ngày giỗ' },
        { id: 'funds', label: 'Quỹ & Đóng góp' },
      ],
    },
    {
      id: 'docs_ai',
      label: 'TƯ LIỆU & AI',
      items: [
        { id: 'documents', label: 'Tư liệu lịch sử' },
        ...(canManageFamily
          ? [{ id: 'family-ai-settings', label: 'Cấu hình AI & Dữ liệu' }]
          : [{ id: 'ai-consent', label: 'Quyền riêng tư & AI' }]),
      ],
    },
    {
      id: 'profile_settings',
      label: 'HỒ SƠ & CÀI ĐẶT',
      items: [
        { id: 'clan-profile', label: 'Hồ sơ gia tộc' },
        { id: 'my-profile', label: 'Hồ sơ của tôi' },
        { id: 'my-clans', label: 'Dòng tộc của tôi' },
        { id: 'my-proposals', label: 'Đề xuất của tôi' },
        { id: 'privacy-settings', label: 'Quyền riêng tư & Bảo mật' },
      ],
    },
  ];

  const visibleGroups = unifiedGroups;

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {!isCollapsed && (
        <div className="sidebar-section-title">
          {isAdmin ? 'QUẢN TRỊ HỆ THỐNG' : 'HỆ THỐNG GIA PHẢ LIÊN HỌ'}
        </div>
      )}

      {isAdmin && (
        <nav className="sidebar-admin-menu" aria-label="Điều hướng Quản trị hệ thống">
          {adminMenuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              title={isCollapsed ? item.label : undefined}
              className={`sidebar-admin-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      )}

      {!isAdmin && visibleGroups.map((group) => {
        const isGroupActive = group.items.some(
          (item) => item.id === activeTab || (item.id === 'events' && activeTab === 'anniversaries')
        );
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
                  const isSubActive =
                    activeTab === subItem.id ||
                    (subItem.id === 'events' && activeTab === 'anniversaries');
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
