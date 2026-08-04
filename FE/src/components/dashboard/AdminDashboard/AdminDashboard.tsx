import React from 'react';
import './AdminDashboard.css';

export interface AdminDashboardProps {
  userName: string;
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName,
  onNavigateTab,
}) => {
  const services = [
    { name: 'FastAPI Backend Core (Python 3.13)', status: 'Online 100%', latency: '24ms' },
    { name: 'PostgreSQL Database Engine', status: 'Online 100%', latency: '12ms' },
    { name: 'Firebase Auth & Token Verifier', status: 'Online 100%', latency: '45ms' },
    { name: 'Vite Frontend Proxy & Dev Server', status: 'Active', latency: '4ms' },
  ];

  return (
    <div className="admin-dash-container">
      {/* Header Banner */}
      <div className="admin-header-banner">
        <div>
          <span className="admin-badge-tag">QUẢN TRỊ HỆ THỐNG • SUPER ADMIN</span>
          <h1 className="admin-title">Bảng Điều Khiển Quản Trị Hệ Thống</h1>
          <p className="admin-subtitle">
            Xin chào <strong>{userName}</strong>. Giám sát toàn bộ nền tảng Gia Phả Việt & Phân quyền bảo mật.
          </p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-title">TỔNG TÀI KHOẢN</div>
            <div className="admin-stat-value">1</div>
          </div>
          <div className="admin-stat-icon">👤</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-title">HOẠT ĐỘNG HÔM NAY</div>
            <div className="admin-stat-value blue">1</div>
          </div>
          <div className="admin-stat-icon">⚡</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-title">TỔNG SỐ DÒNG HỌ</div>
            <div className="admin-stat-value">0</div>
          </div>
          <div className="admin-stat-icon">🏛️</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-title">CẢNH BÁO BẢO MẬT</div>
            <div className="admin-stat-value green">0</div>
          </div>
          <div className="admin-stat-icon">🛡️</div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="admin-sections-grid">
        {/* Realtime Service Health */}
        <div className="admin-card-box">
          <div className="admin-box-header">
            <h3>📡 Trạng Thái Dịch Vụ Realtime</h3>
            <span className="admin-service-stable">Hệ thống ổn định</span>
          </div>

          {services.map((srv, idx) => (
            <div key={idx} className="service-status-row">
              <div>
                <div className="service-name">{srv.name}</div>
                <div className="admin-service-latency">Độ trễ: {srv.latency}</div>
              </div>
              <span className="status-online">{srv.status}</span>
            </div>
          ))}
        </div>

        {/* Quick Admin Actions */}
        <div className="admin-card-box">
          <div className="admin-box-header">
            <h3>⚡ Lối Tắt Vận Hành Quản Trị</h3>
          </div>

          <div className="admin-action-btn-grid">
            <button
              onClick={() => onNavigateTab('admin-account-mgmt')}
              className="admin-action-btn"
            >
              <div className="admin-action-btn-icon">👤</div>
              <strong className="admin-action-btn-title">Quản lý Tài khoản</strong>
              <p className="admin-action-btn-desc">Khóa/Mở tài khoản, cấp quyền</p>
            </button>

            <button
              onClick={() => onNavigateTab('admin-families-mgmt')}
              className="admin-action-btn"
            >
              <div className="admin-action-btn-icon">🏛️</div>
              <strong className="admin-action-btn-title">Quản lý Dòng Họ</strong>
              <p className="admin-action-btn-desc">Danh sách họ tộc trên nền tảng</p>
            </button>

            <button
              onClick={() => onNavigateTab('admin-security-logs')}
              className="admin-action-btn"
            >
              <div className="admin-action-btn-icon">📜</div>
              <strong className="admin-action-btn-title">Nhật ký Bảo mật</strong>
              <p className="admin-action-btn-desc">Lịch sử đăng nhập & thao tác</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
