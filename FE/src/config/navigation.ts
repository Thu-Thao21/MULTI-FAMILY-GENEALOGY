import { ROUTES } from './routes';

export interface NavItem {
  id: string;
  label: string;
  route?: string;
  badge?: string;
  children?: NavItem[];
}

export interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

// 1. MEMBER NAVIGATION (THÀNH VIÊN THƯỜNG)
export const memberNavigation: NavGroup[] = [
  {
    groupLabel: 'QUẢN LÝ GIA PHẢ',
    items: [
      { id: 'dashboard', label: 'Trang chủ', route: ROUTES.USER.DASHBOARD },
      {
        id: 'tree',
        label: 'Cây Gia Phả',
        route: ROUTES.USER.TREE_HORIZONTAL,
      },
      {
        id: 'network',
        label: 'Mạng lưới Liên họ',
        children: [
          { id: 'net-noi', label: 'Dòng họ Nội', route: ROUTES.USER.NETWORK_NOI },
          { id: 'net-ngoai', label: 'Dòng họ Ngoại', route: ROUTES.USER.NETWORK_NGOAI },
          { id: 'net-dau-re', label: 'Dâu & Rể liên họ', route: ROUTES.USER.NETWORK_DAU_RE },
          { id: 'net-thong-gia', label: 'Họ Thông gia', route: ROUTES.USER.NETWORK_THONG_GIA },
        ],
      },
    ],
  },
  {
    groupLabel: 'CÁ NHÂN & THÔNG TIN',
    items: [
      { id: 'member-list', label: 'Hồ sơ & Thành viên', route: ROUTES.USER.MEMBERS },
      { id: 'relationship-finder', label: 'Tra cứu & Xưng hô', route: ROUTES.USER.RELATIONSHIP },
      { id: 'reports-export', label: 'Báo cáo & Xuất nhập', route: ROUTES.USER.REPORTS },
    ],
  },
];


// 3. ADMIN NAVIGATION (QUẢN TRỊ VIÊN HỆ THỐNG)
export const adminNavigation: NavGroup[] = [
  {
    groupLabel: 'QUẢN TRỊ HỆ THỐNG',
    items: [
      { id: 'dashboard', label: 'Dashboard Admin', route: ROUTES.ADMIN.DASHBOARD },
      { id: 'admin-account-mgmt', label: 'Quản Lý Tài Khoản & Phân Quyền', route: ROUTES.ADMIN.ACCOUNTS },
      { id: 'admin-families-mgmt', label: 'Quản Lý Danh Sách Dòng Họ', route: ROUTES.ADMIN.FAMILIES },
    ],
  },
  {
    groupLabel: 'AN NINH & BẢO MẬT',
    items: [
      { id: 'admin-moderation', label: 'Kiểm Duyệt & Tranh Chấp', route: ROUTES.ADMIN.ROOT + '/moderation' },
      { id: 'admin-security-logs', label: 'Nhật Ký Bảo Mật & Hệ Thống', route: ROUTES.ADMIN.SECURITY_LOGS },
      { id: 'admin-service-health', label: 'Trạng Thái Dịch Vụ API/DB', route: ROUTES.ADMIN.ROOT + '/health' },
    ],
  },
  {
    groupLabel: 'LIÊN KẾT & MỞ RỘNG (MỚI)',
    items: [
      { id: 'admin-members-mgmt', label: 'Hồ Sơ Thành Viên Gia Tộc', route: ROUTES.ADMIN.MEMBERS },
      { id: 'admin-family-links', label: 'Yêu Cầu & Phê Duyệt Liên Họ', route: ROUTES.ADMIN.FAMILY_LINKS },
      { id: 'admin-approvals', label: 'Trung Tâm Phê Duyệt Đề Xuất', route: ROUTES.ADMIN.APPROVALS },
      { id: 'admin-data-backup', label: 'Xuất Nhập & Sao Lưu Dữ Liệu', route: ROUTES.ADMIN.BACKUP },
    ],
  },
];

export function getNavigationForRole(role: string): NavGroup[] {
  const r = role.toLowerCase();
  if (r === 'admin') {
    return adminNavigation;
  }

  return memberNavigation;
}

