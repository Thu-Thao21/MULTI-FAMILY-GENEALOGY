export type ServicePackageStatus = 'active' | 'draft' | 'disabled';

export interface ServicePackage {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  durationMonths: number;
  memberLimit: number;
  storageGb: number;
  subscriberCount: number;
  features: string[];
  status: ServicePackageStatus;
  updatedAt: string;
}

export const initialServicePackages: ServicePackage[] = [
  {
    id: 'pkg-community',
    code: 'COMMUNITY',
    name: 'Cộng đồng',
    description: 'Gói khởi đầu dành cho chi họ nhỏ đang số hóa dữ liệu nền tảng.',
    monthlyPrice: 0,
    durationMonths: 12,
    memberLimit: 100,
    storageGb: 2,
    subscriberCount: 126,
    features: ['Cây gia phả cơ bản', 'Hồ sơ thành viên', 'Lịch ngày giỗ'],
    status: 'active',
    updatedAt: '2026-09-10',
  },
  {
    id: 'pkg-standard',
    code: 'STANDARD',
    name: 'Dòng họ Tiêu chuẩn',
    description: 'Đủ công cụ vận hành thường ngày cho một dòng họ quy mô vừa.',
    monthlyPrice: 299000,
    durationMonths: 12,
    memberLimit: 500,
    storageGb: 20,
    subscriberCount: 84,
    features: ['Cây gia phả đa chế độ', 'Quản lý quỹ', 'Kho tư liệu số', 'Nhắc lịch tự động'],
    status: 'active',
    updatedAt: '2026-09-08',
  },
  {
    id: 'pkg-professional',
    code: 'PRO',
    name: 'Dòng họ Chuyên nghiệp',
    description: 'Gói phổ biến cho các dòng họ có nhiều chi nhánh và tư liệu.',
    monthlyPrice: 599000,
    durationMonths: 12,
    memberLimit: 1500,
    storageGb: 80,
    subscriberCount: 47,
    features: ['Mạng lưới liên họ', 'Trợ lý AI', 'Phân quyền nâng cao', 'Xuất báo cáo'],
    status: 'active',
    updatedAt: '2026-09-11',
  },
  {
    id: 'pkg-enterprise',
    code: 'ENTERPRISE',
    name: 'Đại tộc Không giới hạn',
    description: 'Không gian riêng cho đại tộc với nhu cầu lưu trữ và hỗ trợ cao.',
    monthlyPrice: 1499000,
    durationMonths: 12,
    memberLimit: 10000,
    storageGb: 500,
    subscriberCount: 12,
    features: ['Không gian thờ số 3D', 'Sao lưu tự động', 'Hỗ trợ ưu tiên', 'Nhật ký quản trị'],
    status: 'active',
    updatedAt: '2026-09-12',
  },
  {
    id: 'pkg-archive',
    code: 'ARCHIVE',
    name: 'Kho tư liệu Mở rộng',
    description: 'Gói bổ sung dung lượng cho ảnh, phim, âm thanh và gia phả cổ.',
    monthlyPrice: 179000,
    durationMonths: 6,
    memberLimit: 500,
    storageGb: 200,
    subscriberCount: 21,
    features: ['200 GB lưu trữ', 'Xem trước đa phương tiện', 'Phân loại metadata'],
    status: 'draft',
    updatedAt: '2026-09-09',
  },
  {
    id: 'pkg-legacy',
    code: 'LEGACY-2024',
    name: 'Chuyên nghiệp 2024',
    description: 'Gói cũ chỉ duy trì cho thuê bao hiện hữu, không nhận đăng ký mới.',
    monthlyPrice: 459000,
    durationMonths: 12,
    memberLimit: 1000,
    storageGb: 50,
    subscriberCount: 18,
    features: ['Cây gia phả', 'Kho tư liệu', 'Mạng lưới liên họ'],
    status: 'disabled',
    updatedAt: '2026-08-22',
  },
];

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';
export type PaymentMethod = 'VNPay' | 'MoMo' | 'Chuyển khoản' | 'Thẻ quốc tế';

export interface PaymentTransaction {
  id: string;
  userName: string;
  userEmail: string;
  familyName: string;
  packageName: string;
  amount: number;
  method: PaymentMethod;
  createdAt: string;
  status: PaymentStatus;
  reference: string;
  note: string;
}

export const initialPaymentTransactions: PaymentTransaction[] = [
  {
    id: 'TXN-260914-1042',
    userName: 'Nguyễn Đức Minh',
    userEmail: 'minh.nguyen@example.vn',
    familyName: 'Dòng họ Nguyễn – Chi Đông Anh',
    packageName: 'Dòng họ Chuyên nghiệp',
    amount: 7188000,
    method: 'VNPay',
    createdAt: '2026-09-14T09:42:00',
    status: 'success',
    reference: 'VNP-938104285',
    note: 'Gia hạn 12 tháng, hóa đơn điện tử đã phát hành.',
  },
  {
    id: 'TXN-260914-0987',
    userName: 'Trần Thị Bích Ngọc',
    userEmail: 'ngoc.tran@example.vn',
    familyName: 'Gia tộc Trần – Nam Định',
    packageName: 'Dòng họ Tiêu chuẩn',
    amount: 3588000,
    method: 'Chuyển khoản',
    createdAt: '2026-09-14T08:18:00',
    status: 'pending',
    reference: 'VCB-260914-7712',
    note: 'Đang chờ đối soát nội dung chuyển khoản.',
  },
  {
    id: 'TXN-260913-0861',
    userName: 'Lê Hoàng Long',
    userEmail: 'long.le@example.vn',
    familyName: 'Họ Lê – Chi Quảng Trị',
    packageName: 'Kho tư liệu Mở rộng',
    amount: 1074000,
    method: 'MoMo',
    createdAt: '2026-09-13T16:03:00',
    status: 'failed',
    reference: 'MOMO-68150492',
    note: 'Ví không đủ số dư; người dùng có thể thực hiện lại.',
  },
  {
    id: 'TXN-260912-0754',
    userName: 'Phạm Quang Huy',
    userEmail: 'huy.pham@example.vn',
    familyName: 'Phạm tộc – Hải Dương',
    packageName: 'Đại tộc Không giới hạn',
    amount: 17988000,
    method: 'Thẻ quốc tế',
    createdAt: '2026-09-12T14:27:00',
    status: 'success',
    reference: 'CARD-3DS-408331',
    note: 'Thanh toán xác thực 3D Secure thành công.',
  },
  {
    id: 'TXN-260910-0618',
    userName: 'Vũ Thanh Hà',
    userEmail: 'ha.vu@example.vn',
    familyName: 'Vũ tộc – Thái Bình',
    packageName: 'Dòng họ Tiêu chuẩn',
    amount: 3588000,
    method: 'VNPay',
    createdAt: '2026-09-10T11:35:00',
    status: 'refunded',
    reference: 'VNP-926503110',
    note: 'Hoàn tiền theo yêu cầu do đăng ký nhầm dòng họ.',
  },
  {
    id: 'TXN-260908-0533',
    userName: 'Đặng Anh Tuấn',
    userEmail: 'tuan.dang@example.vn',
    familyName: 'Đặng tộc – Bắc Ninh',
    packageName: 'Dòng họ Chuyên nghiệp',
    amount: 7188000,
    method: 'Chuyển khoản',
    createdAt: '2026-09-08T10:12:00',
    status: 'success',
    reference: 'BIDV-260908-1228',
    note: 'Kế toán đã xác nhận giao dịch.',
  },
  {
    id: 'TXN-260901-0411',
    userName: 'Bùi Thị Mai',
    userEmail: 'mai.bui@example.vn',
    familyName: 'Bùi tộc – Hà Nam',
    packageName: 'Dòng họ Tiêu chuẩn',
    amount: 3588000,
    method: 'MoMo',
    createdAt: '2026-09-01T19:45:00',
    status: 'success',
    reference: 'MOMO-65092176',
    note: 'Thanh toán mới 12 tháng.',
  },
  {
    id: 'TXN-260829-0326',
    userName: 'Đỗ Văn Khánh',
    userEmail: 'khanh.do@example.vn',
    familyName: 'Đỗ tộc – Thanh Hóa',
    packageName: 'Dòng họ Chuyên nghiệp',
    amount: 7188000,
    method: 'Thẻ quốc tế',
    createdAt: '2026-08-29T07:56:00',
    status: 'failed',
    reference: 'CARD-3DS-395022',
    note: 'Ngân hàng phát hành từ chối giao dịch.',
  },
  {
    id: 'TXN-260825-0269',
    userName: 'Hoàng Gia Bảo',
    userEmail: 'bao.hoang@example.vn',
    familyName: 'Hoàng tộc – Nghệ An',
    packageName: 'Đại tộc Không giới hạn',
    amount: 17988000,
    method: 'Chuyển khoản',
    createdAt: '2026-08-25T13:40:00',
    status: 'success',
    reference: 'TCB-260825-4456',
    note: 'Khách hàng doanh nghiệp, đã xuất hóa đơn VAT.',
  },
];

export type ModerationStatus = 'pending' | 'reviewing' | 'resolved' | 'rejected';
export type ModerationPriority = 'high' | 'medium' | 'low';
export type ModerationContentType = 'Hồ sơ thành viên' | 'Lời tưởng niệm' | 'Tư liệu số' | 'Bình luận sự kiện';

export interface ModerationReport {
  id: string;
  contentType: ModerationContentType;
  contentTitle: string;
  reportedUser: string;
  reporter: string;
  reason: string;
  description: string;
  createdAt: string;
  status: ModerationStatus;
  priority: ModerationPriority;
  contentHidden: boolean;
}

export const initialModerationReports: ModerationReport[] = [
  {
    id: 'MOD-2026-0142',
    contentType: 'Lời tưởng niệm',
    contentTitle: 'Lời nhắn tại gian thờ Cụ Nguyễn Văn Tông',
    reportedUser: 'Tài khoản nguyenvana92',
    reporter: 'Nguyễn Minh Châu',
    reason: 'Ngôn từ thiếu trang trọng',
    description: 'Nội dung có cách diễn đạt không phù hợp với không gian tưởng niệm và quy ước của dòng họ.',
    createdAt: '2026-09-14T08:55:00',
    status: 'pending',
    priority: 'high',
    contentHidden: false,
  },
  {
    id: 'MOD-2026-0139',
    contentType: 'Hồ sơ thành viên',
    contentTitle: 'Hồ sơ Trần Văn Khải – Đời thứ 5',
    reportedUser: 'trankhai.family',
    reporter: 'Trần Thu Hương',
    reason: 'Thông tin cá nhân không chính xác',
    description: 'Ngày sinh và mối quan hệ cha con đang khác với gia phả giấy đã được hội đồng xác nhận.',
    createdAt: '2026-09-13T15:20:00',
    status: 'reviewing',
    priority: 'medium',
    contentHidden: false,
  },
  {
    id: 'MOD-2026-0131',
    contentType: 'Tư liệu số',
    contentTitle: 'Ảnh gia phả cổ năm 1921',
    reportedUser: 'archive_contributor_08',
    reporter: 'Lê Gia Phúc',
    reason: 'Có dấu hiệu trùng lặp',
    description: 'Tệp đã tồn tại trong kho tư liệu với mã DOC-00821 và metadata tương tự.',
    createdAt: '2026-09-11T10:06:00',
    status: 'pending',
    priority: 'low',
    contentHidden: false,
  },
  {
    id: 'MOD-2026-0124',
    contentType: 'Bình luận sự kiện',
    contentTitle: 'Bình luận tại Đại hội dòng họ Phạm 2026',
    reportedUser: 'phamthanh1988',
    reporter: 'Phạm Anh Khoa',
    reason: 'Nội dung gây tranh cãi',
    description: 'Bình luận chứa cáo buộc chưa được kiểm chứng, có thể ảnh hưởng uy tín thành viên.',
    createdAt: '2026-09-08T20:14:00',
    status: 'resolved',
    priority: 'high',
    contentHidden: true,
  },
  {
    id: 'MOD-2026-0118',
    contentType: 'Hồ sơ thành viên',
    contentTitle: 'Yêu cầu ẩn thông tin liên hệ',
    reportedUser: 'vuthanhha',
    reporter: 'Vũ Thanh Hà',
    reason: 'Yêu cầu quyền riêng tư',
    description: 'Chủ hồ sơ yêu cầu ẩn số điện thoại khỏi phạm vi toàn dòng họ.',
    createdAt: '2026-09-04T09:31:00',
    status: 'resolved',
    priority: 'medium',
    contentHidden: false,
  },
  {
    id: 'MOD-2026-0109',
    contentType: 'Tư liệu số',
    contentTitle: 'Video lễ giỗ tổ 2019',
    reportedUser: 'do_archive_team',
    reporter: 'Đỗ Văn Phúc',
    reason: 'Không vi phạm',
    description: 'Báo cáo nhầm do người gửi chưa nhận ra watermark của ban tư liệu.',
    createdAt: '2026-08-29T14:45:00',
    status: 'rejected',
    priority: 'low',
    contentHidden: false,
  },
];

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export interface PermissionSet {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface PermissionModule {
  id: string;
  label: string;
  description: string;
  category: 'Gia phả' | 'Đời sống dòng họ' | 'Nền tảng';
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  locked?: boolean;
  permissions: Record<string, PermissionSet>;
}

export const permissionModules: PermissionModule[] = [
  { id: 'members', label: 'Hồ sơ thành viên', description: 'Thông tin nhân khẩu và hồ sơ cá nhân.', category: 'Gia phả' },
  { id: 'tree', label: 'Cây gia phả', description: 'Cấu trúc phả hệ và quan hệ huyết thống.', category: 'Gia phả' },
  { id: 'relationships', label: 'Đề xuất quan hệ', description: 'Đề xuất và phê duyệt thay đổi quan hệ.', category: 'Gia phả' },
  { id: 'events', label: 'Sự kiện dòng họ', description: 'Lịch, người tham gia và nội dung sự kiện.', category: 'Đời sống dòng họ' },
  { id: 'funds', label: 'Quỹ dòng họ', description: 'Thu, chi và xác nhận giao dịch quỹ.', category: 'Đời sống dòng họ' },
  { id: 'archive', label: 'Kho tư liệu số', description: 'Ảnh, video, âm thanh và tài liệu lịch sử.', category: 'Đời sống dòng họ' },
  { id: 'worship', label: 'Không gian thờ số', description: 'Gian thờ, hương ảo và lời tưởng niệm.', category: 'Đời sống dòng họ' },
  { id: 'packages', label: 'Gói dịch vụ', description: 'Danh mục và trạng thái gói nền tảng.', category: 'Nền tảng' },
  { id: 'payments', label: 'Thanh toán', description: 'Đối soát và hoàn tiền giao dịch.', category: 'Nền tảng' },
  { id: 'moderation', label: 'Kiểm duyệt', description: 'Báo cáo nội dung và xử lý vi phạm.', category: 'Nền tảng' },
  { id: 'audit', label: 'Nhật ký hệ thống', description: 'Lịch sử thao tác và sự kiện bảo mật.', category: 'Nền tảng' },
];

const none = (): PermissionSet => ({ view: false, create: false, update: false, delete: false });
const read = (): PermissionSet => ({ view: true, create: false, update: false, delete: false });
const manage = (): PermissionSet => ({ view: true, create: true, update: true, delete: false });
const full = (): PermissionSet => ({ view: true, create: true, update: true, delete: true });

export const initialRoleDefinitions: RoleDefinition[] = [
  {
    id: 'system-admin',
    name: 'Quản trị viên hệ thống',
    description: 'Toàn quyền vận hành nền tảng. Vai trò lõi không thể chỉnh sửa.',
    memberCount: 4,
    locked: true,
    permissions: Object.fromEntries(permissionModules.map((module) => [module.id, full()])),
  },
  {
    id: 'family-head',
    name: 'Chủ dòng họ',
    description: 'Quản lý dữ liệu, thành viên và hoạt động trong dòng họ phụ trách.',
    memberCount: 38,
    permissions: {
      members: full(), tree: full(), relationships: manage(), events: full(), funds: manage(), archive: full(), worship: manage(),
      packages: read(), payments: read(), moderation: read(), audit: read(),
    },
  },
  {
    id: 'moderator',
    name: 'Điều phối viên nội dung',
    description: 'Xử lý báo cáo, duyệt tư liệu và hỗ trợ hoạt động cộng đồng.',
    memberCount: 12,
    permissions: {
      members: read(), tree: read(), relationships: manage(), events: manage(), funds: read(), archive: manage(), worship: manage(),
      packages: none(), payments: none(), moderation: manage(), audit: read(),
    },
  },
  {
    id: 'member',
    name: 'Thành viên',
    description: 'Xem dữ liệu được chia sẻ và đóng góp nội dung theo quyền riêng tư.',
    memberCount: 1248,
    permissions: {
      members: read(), tree: read(), relationships: { view: true, create: true, update: false, delete: false },
      events: { view: true, create: false, update: false, delete: false }, funds: read(),
      archive: { view: true, create: true, update: false, delete: false }, worship: { view: true, create: true, update: false, delete: false },
      packages: read(), payments: none(), moderation: { view: true, create: true, update: false, delete: false }, audit: none(),
    },
  },
];

export function cloneRoleDefinitions(roles: RoleDefinition[]): RoleDefinition[] {
  return roles.map((role) => ({
    ...role,
    permissions: Object.fromEntries(
      Object.entries(role.permissions).map(([moduleId, permissions]) => [moduleId, { ...permissions }])
    ),
  }));
}
