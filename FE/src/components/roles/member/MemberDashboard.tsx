import React from 'react';
import './MemberDashboard.css';
import { PersonalizedOverview } from '../../dashboard/PersonalizedOverview';
import { UpcomingEventsWidget } from '../../dashboard/UpcomingEventsWidget';
import { RecentActivitiesWidget } from '../../dashboard/RecentActivitiesWidget';

export interface MemberDashboardProps {
  userName: string;
  userRole: string;
  onNavigateTab?: (tabId: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  userName,
  userRole,
  onNavigateTab,
}) => {
  const isFamilyOwner = true; // Later: check if user owns any family

  return (
    <>
      <PersonalizedOverview
        userName={userName}
        userRole={userRole}
      />

      {isFamilyOwner && (
        <div className="member-dash-head-section">
          <div className="member-dash-head-header">
            <div className="member-dash-head-title-row">
              <span className="member-dash-head-icon">👑</span>
              <h3 className="member-dash-head-title">
                Khu Vực Quản Lý Dòng Họ
              </h3>
            </div>
            <span className="member-dash-head-badge">
              CHỦ DÒNG HỌ
            </span>
          </div>
          <p className="member-dash-head-desc">
            Bạn đang có quyền quản trị dòng họ phụ trách: Quản lý thành viên, Chi/Nhánh, duyệt đề xuất chỉnh sửa và xuất nhập dữ liệu Excel.
          </p>

          <div className="member-dash-head-grid">
            <button
              onClick={() => onNavigateTab && onNavigateTab('family-management')}
              className="member-dash-head-btn"
            >
              👥 Quản lý thành viên
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('family-branches')}
              className="member-dash-head-btn"
            >
              🌿 Quản lý Chi & Nhánh
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('family-approvals')}
              className="member-dash-head-btn"
            >
              ✅ Phê duyệt đề xuất
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('family-import-export')}
              className="member-dash-head-btn"
            >
              📥 Xuất nhập dữ liệu
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Đời Sống & Sự Kiện Gia Tộc</h2>
          <p className="dashboard-section-subtitle">
            Theo dõi lịch giỗ tổ, mừng thọ và các cập nhật mới nhất trong gia phả.
          </p>
        </div>

        <div className="dashboard-widgets-grid">
          <UpcomingEventsWidget />
          <RecentActivitiesWidget />
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;
