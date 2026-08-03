import React from 'react';
import { PersonalizedOverview } from '../../dashboard/PersonalizedOverview';
import { UpcomingEventsWidget } from '../../dashboard/UpcomingEventsWidget';
import { RecentActivitiesWidget } from '../../dashboard/RecentActivitiesWidget';

export interface MemberDashboardProps {
  userName: string;
  userRole: string;
  onRequestRole: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  userName,
  userRole,
  onRequestRole,
}) => {
  return (
    <>
      <PersonalizedOverview
        userName={userName}
        userRole={userRole}
        onRequestRole={onRequestRole}
      />

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
