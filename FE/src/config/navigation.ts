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

// 1. MEMBER NAVIGATION (THÀNH VIÊN THƯỜNG - 38 FRs)
export const memberNavigation: NavGroup[] = [
  {
    groupLabel: 'TỔNG QUAN',
    items: [
      { id: 'dashboard', label: 'Trang chủ', route: ROUTES.USER.DASHBOARD },
      { id: 'notifications', label: 'Thông báo cá nhân', route: ROUTES.USER.NOTIFICATIONS },
    ],
  },
  {
    groupLabel: 'GIA PHẢ & QUAN HỆ',
    items: [
      { id: 'tree', label: 'Cây Gia Phả', route: ROUTES.USER.TREE_HORIZONTAL },
      { id: 'member-list', label: 'Danh sách thành viên', route: ROUTES.USER.MEMBERS },
      { id: 'relationship-finder', label: 'Tra cứu & Xưng hô', route: ROUTES.USER.RELATIONSHIP },
    ],
  },
  {
    groupLabel: 'MẠNG LƯỚI LIÊN HỌ',
    items: [
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
    groupLabel: 'HỒ SƠ & ĐỀ XUẤT',
    items: [
      { id: 'my-profile', label: 'Hồ sơ của tôi', route: ROUTES.USER.MY_PROFILE },
      { id: 'my-proposals', label: 'Đề xuất của tôi', route: ROUTES.USER.PROPOSALS },
    ],
  },
  {
    groupLabel: 'ĐỜI SỐNG DÒNG HỌ',
    items: [
      { id: 'anniversaries', label: 'Lịch ngày giỗ', route: ROUTES.USER.ANNIVERSARIES },
      { id: 'events', label: 'Sự kiện dòng họ', route: ROUTES.USER.EVENTS },
      { id: 'funds', label: 'Quỹ & Đóng góp', route: ROUTES.USER.FUNDS },
      { id: 'ancestral-hall', label: 'Phòng thờ số', route: ROUTES.USER.ANCESTRAL_HALL },
    ],
  },
  {
    groupLabel: 'TƯ LIỆU & AI',
    items: [
      { id: 'documents', label: 'Tư liệu lịch sử', route: ROUTES.USER.DOCUMENTS },
      { id: 'ai-assistant', label: 'Trợ lý AI dòng họ', route: ROUTES.USER.AI_ASSISTANT },
    ],
  },
  {
    groupLabel: 'CÀI ĐẶT & BẢO MẬT',
    items: [
      { id: 'privacy-settings', label: 'Quyền riêng tư', route: ROUTES.USER.PRIVACY_SETTINGS },
      { id: 'privacy-preview', label: 'Xem trước góc nhìn', route: ROUTES.USER.PRIVACY_PREVIEW },
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

