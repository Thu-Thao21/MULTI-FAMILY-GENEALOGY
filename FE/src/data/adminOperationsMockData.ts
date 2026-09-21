export type AuditLevel = 'info' | 'warning' | 'security' | 'error';
export type AuditStatus = 'success' | 'failed';

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ip: string;
  device: string;
  status: AuditStatus;
  level: AuditLevel;
  detail: string;
}

export const auditLogMockData: AuditLogRecord[] = [
  { id: 'LOG-260914-0921', timestamp: '2026-09-14T09:21:00', user: 'admin@giaphaviet.vn', action: 'Cập nhật vai trò tài khoản', module: 'Phân quyền', ip: '113.160.42.18', device: 'Chrome · macOS', status: 'success', level: 'security', detail: 'Gán vai trò Chủ dòng họ cho tài khoản nguyenvanminh.' },
  { id: 'LOG-260914-0858', timestamp: '2026-09-14T08:58:00', user: 'Hệ thống', action: 'Sao lưu dữ liệu định kỳ', module: 'Sao lưu', ip: '10.0.0.12', device: 'Worker backup-02', status: 'success', level: 'info', detail: 'Snapshot toàn hệ thống hoàn tất, checksum đã được xác minh.' },
  { id: 'LOG-260913-2240', timestamp: '2026-09-13T22:40:00', user: 'tranthilan', action: 'Đăng nhập không thành công', module: 'Xác thực', ip: '14.177.84.211', device: 'Safari · iPhone', status: 'failed', level: 'warning', detail: 'Sai mật khẩu 3 lần liên tiếp; tài khoản chưa bị khóa.' },
  { id: 'LOG-260913-1632', timestamp: '2026-09-13T16:32:00', user: 'nguyenvanminh', action: 'Phê duyệt đề xuất quan hệ', module: 'Đề xuất', ip: '171.244.52.90', device: 'Edge · Windows', status: 'success', level: 'info', detail: 'Phê duyệt đề xuất DX-260908 sau khi kiểm tra giấy khai sinh.' },
  { id: 'LOG-260912-1415', timestamp: '2026-09-12T14:15:00', user: 'admin@giaphaviet.vn', action: 'Ẩn nội dung bị báo cáo', module: 'Kiểm duyệt', ip: '113.160.42.18', device: 'Chrome · macOS', status: 'success', level: 'security', detail: 'Ẩn lời tưởng niệm BC-260907-008 trong khi chờ xác minh.' },
  { id: 'LOG-260911-1102', timestamp: '2026-09-11T11:02:00', user: 'Hệ thống', action: 'Đồng bộ kho tư liệu thất bại', module: 'Kho tư liệu', ip: '10.0.0.24', device: 'Archive worker-01', status: 'failed', level: 'error', detail: 'Hết thời gian chờ khi tạo thumbnail video; sẽ tự động thử lại.' },
  { id: 'LOG-260910-0910', timestamp: '2026-09-10T09:10:00', user: 'levananh', action: 'Xuất danh sách thành viên', module: 'Xuất nhập', ip: '27.71.113.52', device: 'Chrome · Android', status: 'success', level: 'info', detail: 'Xuất 428 hồ sơ trong phạm vi quyền dòng họ Lê.' },
  { id: 'LOG-260909-1744', timestamp: '2026-09-09T17:44:00', user: 'phamquanghuy', action: 'Yêu cầu khôi phục dữ liệu', module: 'Sao lưu', ip: '118.69.74.29', device: 'Firefox · Windows', status: 'failed', level: 'security', detail: 'Yêu cầu bị từ chối vì tài khoản không có quyền Restore.' },
];

export type BackupStatus = 'success' | 'processing' | 'failed';

export interface BackupRecord {
  id: string;
  name: string;
  type: 'Full' | 'Incremental' | 'Manual';
  createdAt: string;
  size: string;
  status: BackupStatus;
  createdBy: string;
}

export const backupMockData: BackupRecord[] = [
  { id: 'BAK-260914', name: 'mfgms_full_2026_09_14.sql.gz', type: 'Full', createdAt: '2026-09-14T02:00:00', size: '2.84 GB', status: 'success', createdBy: 'Lịch tự động' },
  { id: 'BAK-260913', name: 'mfgms_incremental_2026_09_13.tar.gz', type: 'Incremental', createdAt: '2026-09-13T02:00:00', size: '184 MB', status: 'success', createdBy: 'Lịch tự động' },
  { id: 'BAK-260912', name: 'before_permission_update_2026_09_12.sql.gz', type: 'Manual', createdAt: '2026-09-12T14:18:00', size: '2.72 GB', status: 'success', createdBy: 'Admin hệ thống' },
  { id: 'BAK-260911', name: 'mfgms_incremental_2026_09_11.tar.gz', type: 'Incremental', createdAt: '2026-09-11T02:00:00', size: '—', status: 'failed', createdBy: 'Lịch tự động' },
  { id: 'BAK-260910', name: 'mfgms_full_2026_09_10.sql.gz', type: 'Full', createdAt: '2026-09-10T02:00:00', size: '2.69 GB', status: 'success', createdBy: 'Lịch tự động' },
];
