import React from 'react';
import './AdminDashboard.css';
import { RecentActivitiesWidget } from '../RecentActivitiesWidget';

export interface AdminDashboardProps {
  userName: string;
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName,
  onNavigateTab,
}) => {
  const services = [
    { name: 'Dịch vụ Hệ thống Xử lý Dữ liệu Lõi', status: 'Hoạt động mượt mà', sub: 'Thời gian phản hồi thời gian thực' },
    { name: 'Cơ sở Dữ liệu Dòng họ Toàn cục', status: 'Đồng bộ 100%', sub: 'Dữ liệu liên kết an toàn & toàn vẹn' },
    { name: 'Dịch vụ Xác thực & Bảo mật Tài khoản', status: 'Trực tuyến', sub: 'Mã hóa an toàn đa tầng' },
    { name: 'Cổng Giao diện Vận hành Nền tảng', status: 'Sẵn sàng', sub: 'Kết nối liên thông các dòng họ' },
  ];

  const metricCards = [
    {
      title: 'Tổng số tài khoản',
      value: '1 Tài khoản',
      subtext: 'Tài khoản hệ thống đã đăng ký',
      tag: 'Hệ thống',
    },
    {
      title: 'Tổng số dòng họ',
      value: '0 Dòng họ',
      subtext: 'Họ tộc liên kết trên nền tảng',
      tag: 'Họ tộc',
    },
    {
      title: 'Yêu cầu cần duyệt',
      value: '0 Đề xuất',
      subtext: 'Yêu cầu chỉnh sửa đang chờ duyệt',
      tag: 'Phê duyệt',
    },
    {
      title: 'Trạng thái hệ thống',
      value: 'Ổn định 100%',
      subtext: 'Tất cả dịch vụ vận hành an toàn',
      tag: 'Bảo mật',
    },
  ];

  const mockAdminActivities = [
    { id: 1, user: 'Hệ thống', action: 'Tự động sao lưu dữ liệu toàn hệ thống thành công', time: '10 phút trước' },
    { id: 2, user: 'Ban Quản trị', action: 'Đăng nhập vào bảng điều khiển Quản trị viên Toàn cục', time: '5 phút trước' },
    { id: 3, user: 'Hệ thống', action: 'Đồng bộ hóa dữ liệu các chi nhánh dòng họ thành công', time: '1 giờ trước' },
    { id: 4, user: 'Hệ thống', action: 'Khởi chạy cổng giao diện quản trị vận hành trực tuyến', time: '2 giờ trước' },
  ];

  return (
    <div className="admin-dash-container">
      {/* Personalized Welcome Banner for Admin */}
      <div className="admin-header-banner">
        <div>
          <div className="admin-system-tag">BAN QUẢN TRỊ HỆ THỐNG GIA PHẢ TOÀN CỤC</div>
          <h1 className="admin-greeting">
            Xin chào {userName}, chúc bạn một ngày làm việc hiệu quả!
          </h1>
          <p className="admin-subtext">
            Bạn đang truy cập với vai trò <strong>Quản Trị Viên Toàn Cục</strong>. Nền tảng đang trực tuyến, sẵn sàng vận hành, hỗ trợ và kết nối các dòng họ trên toàn quốc.
          </p>
        </div>
      </div>

      {/* Admin Platform Stats Grid */}
      <div className="admin-stats-grid">
        {metricCards.map((card, index) => (
          <div key={index} className="admin-stat-card">
            <div className="admin-stat-card-main">
              <div className="admin-stat-card-header">
                <span className="admin-stat-card-title">{card.title}</span>
                <span className="admin-stat-card-tag">{card.tag}</span>
              </div>
              <div className="admin-stat-card-value">{card.value}</div>
            </div>
            <div className="admin-stat-card-footer">{card.subtext}</div>
          </div>
        ))}
      </div>

      {/* Centerpiece: Admin Operations */}
      <div className="admin-operations-section">
        <div className="admin-operations-header">
          <div className="admin-operations-title-row">
            <h3 className="admin-operations-title">
              Trung Tâm Vận Hành & Quản Trị Hệ Thống
            </h3>
          </div>
          <span className="admin-operations-badge">
            QUẢN TRỊ VIÊN TOÀN CỤC
          </span>
        </div>
        <p className="admin-operations-desc">
          Các lối tắt truy cập nhanh chức năng quản trị cấp cao. Vui lòng thao tác cẩn trọng khi thực hiện cập nhật cấu trúc dữ liệu nền tảng.
        </p>

        <div className="admin-operations-grid">
          <button
            onClick={() => onNavigateTab('admin-permissions')}
            className="admin-operations-btn"
          >
            Phân quyền tài khoản
          </button>
          <button
            onClick={() => onNavigateTab('admin-families-mgmt')}
            className="admin-operations-btn"
          >
            Quản lý dòng họ
          </button>
          <button
            onClick={() => onNavigateTab('admin-members-mgmt')}
            className="admin-operations-btn"
          >
            Quản lý thành viên
          </button>
          <button
            onClick={() => onNavigateTab('admin-family-links')}
            className="admin-operations-btn"
          >
            Liên kết dòng họ
          </button>
          <button
            onClick={() => onNavigateTab('admin-approval')}
            className="admin-operations-btn"
          >
            Phê duyệt đề xuất
          </button>
          <button
            onClick={() => onNavigateTab('admin-logs')}
            className="admin-operations-btn"
          >
            Nhật ký hệ thống
          </button>
          <button
            onClick={() => onNavigateTab('admin-data-backup')}
            className="admin-operations-btn"
          >
            Sao lưu & Phục hồi
          </button>
        </div>
      </div>

      {/* Lower Section: Infrastructure Health & Logs */}
      <div>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Trạng Thái Vận Hành & Nhật Ký Hoạt Động</h2>
          <p className="dashboard-section-subtitle">
            Theo dõi tình trạng vận hành dịch vụ và lịch sử thao tác hệ thống thời gian thực.
          </p>
        </div>

        <div className="admin-widgets-grid">
          {/* Services Health */}
          <div className="admin-services-health-card">
            <div className="admin-services-health-header">
              <h3 className="admin-services-health-title">Tình Trạng Dịch Vụ Nền Tảng</h3>
              <span className="admin-service-stable-badge">Hệ thống ổn định</span>
            </div>

            <div className="admin-services-list">
              {services.map((srv, idx) => (
                <div key={idx} className="admin-service-row">
                  <div>
                    <div className="admin-service-name">{srv.name}</div>
                    <div className="admin-service-latency">{srv.sub}</div>
                  </div>
                  <span className="admin-service-status-online">{srv.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Activity Logs widget */}
          <RecentActivitiesWidget activities={mockAdminActivities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
