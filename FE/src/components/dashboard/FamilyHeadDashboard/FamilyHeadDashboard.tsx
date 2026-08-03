import React, { useState } from 'react';
import './FamilyHeadDashboard.css';

export interface FamilyHeadDashboardProps {
  userName: string;
  onNavigateTab: (tabId: string) => void;
}

export const FamilyHeadDashboard: React.FC<FamilyHeadDashboardProps> = ({
  userName,
  onNavigateTab,
}) => {
  const [selectedScope, setSelectedScope] = useState('main-branch');

  // Real pending requests list (empty by default until DB records exist)
  const pendingRequests: any[] = [];

  return (
    <div className="fh-dashboard-container">
      {/* Header Banner */}
      <div className="fh-header-banner">
        <div>
          <span className="fh-badge-tag">TRƯỞNG TỘC • QUẢN LÝ DÒNG HỌ</span>
          <h1 className="fh-title">Khu Vực Quản Lý Dòng Họ</h1>
          <p className="fh-subtitle">
            Kính chào Trưởng Họ <strong>{userName}</strong>. Bạn đang xem bảng điều khiển quản lý trực hệ.
          </p>

          <div className="fh-scope-selector-container">
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Dòng họ đang quản lý:</span>
            <select
              className="fh-scope-select"
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
            >
              <option value="main-branch">Trực Hệ Dòng Họ Quản Lý</option>
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={() => onNavigateTab('family-members-mgmt')}
            className="fh-action-btn-primary"
          >
            + Thêm Thành Viên Mới
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="fh-stats-grid">
        <div className="fh-stat-card">
          <div>
            <div className="fh-stat-title">TỔNG THÀNH VIÊN DÒNG HỌ</div>
            <div className="fh-stat-value">0</div>
          </div>
          <div className="fh-stat-icon">👥</div>
        </div>

        <div className="fh-stat-card">
          <div>
            <div className="fh-stat-title">SỐ THẾ HỆ / ĐỜI</div>
            <div className="fh-stat-value">0 Đời</div>
          </div>
          <div className="fh-stat-icon">🌳</div>
        </div>

        <div className="fh-stat-card action-needed">
          <div>
            <div className="fh-stat-title">YÊU CẦU CHỜ DUYỆT</div>
            <div className="fh-stat-value" style={{ color: '#64748b' }}>0</div>
          </div>
          <div className="fh-stat-icon">📋</div>
        </div>

        <div className="fh-stat-card alert">
          <div>
            <div className="fh-stat-title">LỜI MỜI ĐANG HOẠT ĐỘNG</div>
            <div className="fh-stat-value" style={{ color: '#64748b' }}>0</div>
          </div>
          <div className="fh-stat-icon">✉️</div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="fh-sections-grid">
        {/* Work items needing approval */}
        <div className="fh-card-box">
          <div className="fh-box-header">
            <h3>📋 Yêu Cầu Cần Phê Duyệt Nhanh</h3>
            <button
              onClick={() => onNavigateTab('family-approvals')}
              style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer' }}
            >
              Xem tất cả →
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              Chưa có yêu cầu gia nhập hoặc chỉnh sửa nào trong hệ thống.
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div key={req.id} className="fh-pending-item">
                <div className="fh-pending-info">
                  <h4>{req.sender} — <span style={{ fontWeight: 500, color: '#059669' }}>{req.type}</span></h4>
                  <p>{req.details} • <em>{req.date}</em></p>
                </div>
                <div>
                  <button
                    onClick={() => onNavigateTab('family-approvals')}
                    className="btn-sm-approve"
                  >
                    Duyệt
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Data Quality & System Warnings */}
        <div className="fh-card-box">
          <div className="fh-box-header">
            <h3>⚠️ Chất Lượng Dữ Liệu & Cảnh Báo</h3>
          </div>

          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            Không có cảnh báo bất thường về dữ liệu.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyHeadDashboard;
