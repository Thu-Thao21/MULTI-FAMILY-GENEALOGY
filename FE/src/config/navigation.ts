export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const memberNavigation: NavGroup[] = [
  {
    groupLabel: 'QUẢN LÝ GIA PHẢ',
    items: [
      { id: 'dashboard', label: 'Trang chủ', icon: '🏠' },
      {
        id: 'tree',
        label: 'Cây Gia Phả',
        icon: '🌳',
        children: [
          { id: 'tree-vertical', label: 'Sơ đồ đứng (Vertical)' },
          { id: 'tree-horizontal', label: 'Sơ đồ ngang (Horizontal)' },
          { id: 'tree-focus', label: 'Chế độ Tập trung (Focus View)' },
        ],
      },
      {
        id: 'network',
        label: 'Mạng lưới Liên họ',
        icon: '🌐',
        children: [
          { id: 'net-noi', label: 'Dòng họ Nội' },
          { id: 'net-ngoai', label: 'Dòng họ Ngoại' },
          { id: 'net-dau-re', label: 'Dâu & Rể liên họ' },
          { id: 'net-thong-gia', label: 'Họ Thông gia' },
        ],
      },
    ],
  },
  {
    groupLabel: 'CÁ NHÂN & THÔNG TIN',
    items: [
      { id: 'member-list', label: 'Hồ sơ & Thành viên', icon: '👥' },
      { id: 'relationship-finder', label: 'Tra cứu & Xưng hô', icon: '🔍' },
      { id: 'reports-export', label: 'Báo cáo & Xuất nhập', icon: '📊' },
    ],
  },
];

export const familyHeadNavigation: NavGroup[] = [
  {
    groupLabel: 'QUẢN LÝ DÒNG HỌ',
    items: [
      { id: 'dashboard', label: 'Dashboard Trưởng Tộc', icon: '👑' },
      {
        id: 'tree-management',
        label: 'Quản Lý Cây Gia Phả',
        icon: '🌳',
        children: [
          { id: 'tree-vertical', label: 'Cây Trực Hệ & Chỉnh Sửa' },
          { id: 'tree-horizontal', label: 'Sơ Đồ Ngang Gia Tộc' },
          { id: 'tree-focus', label: 'Chế Độ Tập Trung Nút' },
        ],
      },
      { id: 'family-members-mgmt', label: 'Quản Lý Thành Viên', icon: '👥' },
      { id: 'family-approvals', label: 'Trung Tâm Phê Duyệt', icon: '📋' },
    ],
  },
  {
    groupLabel: 'MỞ RỘNG & VẬN HÀNH',
    items: [
      { id: 'family-invitations', label: 'Tạo Lời Mời & Mã QR', icon: '✉️' },
      {
        id: 'network',
        label: 'Mạng Lưới Liên Họ',
        icon: '🌐',
        children: [
          { id: 'net-noi', label: 'Dòng họ Nội' },
          { id: 'net-ngoai', label: 'Dòng họ Ngoại' },
          { id: 'net-dau-re', label: 'Dâu & Rể liên họ' },
          { id: 'net-thong-gia', label: 'Họ Thông gia' },
        ],
      },
      { id: 'family-audit-log', label: 'Nhật Ký Thay Đổi Dòng Họ', icon: '📜' },
    ],
  },
];

export const adminNavigation: NavGroup[] = [
  {
    groupLabel: 'QUẢN TRỊ HỆ THỐNG',
    items: [
      { id: 'dashboard', label: 'Dashboard Admin', icon: '⚙️' },
      { id: 'admin-role-requests', label: 'Phê Duyệt Quyền Trưởng Họ', icon: '⭐' },
      { id: 'admin-account-mgmt', label: 'Quản Lý Tài Khoản & Phân Quyền', icon: '👤' },
      { id: 'admin-families-mgmt', label: 'Quản Lý Danh Sách Dòng Họ', icon: '🏛️' },
    ],
  },
  {
    groupLabel: 'AN NINH & BẢO MẬT',
    items: [
      { id: 'admin-moderation', label: 'Kiểm Duyệt & Tranh Chấp', icon: '🛡️' },
      { id: 'admin-security-logs', label: 'Nhật Ký Bảo Mật & Hệ Thống', icon: '📜' },
      { id: 'admin-service-health', label: 'Trạng Thái Dịch Vụ API/DB', icon: '📡' },
    ],
  },
];

export function getNavigationForRole(role: string): NavGroup[] {
  switch (role.toLowerCase()) {
    case 'admin':
      return adminNavigation;
    case 'family_head':
      return familyHeadNavigation;
    case 'member':
    default:
      return memberNavigation;
  }
}
