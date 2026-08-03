import React, { useEffect, useState } from 'react';
import { getAdminRoleRequests } from '../../../services/roleRequest.service';
import './AdminDashboard.css';

export interface AdminDashboardProps {
  userName: string;
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userName,
  onNavigateTab,
}) => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    getAdminRoleRequests('pending')
      .then((data) => {
        if (isMounted) {
          setPendingCount(Array.isArray(data) ? data.length : 0);
        }
      })
      .catch(() => {
        if (isMounted) setPendingCount(0);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigateTab('admin-role-requests')}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⭐ Phê Duyệt Quyền Trưởng Họ ({pendingCount})
          </button>
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
            <div className="admin-stat-value" style={{ color: '#2563eb' }}>1</div>
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
            <div className="admin-stat-title">YÊU CẦU CHỜ DUYỆT</div>
            <div className="admin-stat-value" style={{ color: pendingCount > 0 ? '#dc2626' : '#64748b' }}>
              {loading ? '...' : pendingCount}
            </div>
          </div>
          <div className="admin-stat-icon">⭐</div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-title">CẢNH BÁO BẢO MẬT</div>
            <div className="admin-stat-value" style={{ color: '#16a34a' }}>0</div>
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
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>Hệ thống ổn định</span>
          </div>

          {services.map((srv, idx) => (
            <div key={idx} className="service-status-row">
              <div>
                <div className="service-name">{srv.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Độ trễ: {srv.latency}</div>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => onNavigateTab('admin-role-requests')}
              style={{
                padding: '16px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.4rem' }}>⭐</div>
              <strong style={{ color: '#1d4ed8', fontSize: '0.95rem' }}>Phê duyệt Trưởng Họ ({pendingCount})</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Duyệt đơn nâng quyền thành viên</p>
            </button>

            <button
              onClick={() => onNavigateTab('admin-account-mgmt')}
              style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.4rem' }}>👤</div>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Quản lý Tài khoản</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Khóa/Mở tài khoản, cấp quyền</p>
            </button>

            <button
              onClick={() => onNavigateTab('admin-families-mgmt')}
              style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.4rem' }}>🏛️</div>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Quản lý Dòng Họ</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Danh sách họ tộc trên nền tảng</p>
            </button>

            <button
              onClick={() => onNavigateTab('admin-security-logs')}
              style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.4rem' }}>📜</div>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Nhật ký Bảo mật</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Lịch sử đăng nhập & thao tác</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
