import React from 'react';
import './StatsOverview.css';

export interface StatsOverviewProps {
  familiesCount?: number;
  membersCount?: number;
  marriagesCount?: number;
  eventsCount?: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  familiesCount = 0,
  membersCount = 0,
  marriagesCount = 0,
  eventsCount = 0,
}) => {
  const stats = [
    {
      id: 1,
      title: 'Dòng Họ Liên Kết',
      value: `${familiesCount} Dòng Họ`,
      subtext: 'Danh sách dòng họ',
      icon: '⛩️',
      variant: 'blue',
      badge: 'Hệ thống',
    },
    {
      id: 2,
      title: 'Tổng Thành Viên',
      value: `${membersCount} Người`,
      subtext: 'Thành viên trực hệ',
      icon: '👥',
      variant: 'purple',
      badge: 'Phả hệ',
    },
    {
      id: 3,
      title: 'Quan Hệ Hôn Nhân',
      value: `${marriagesCount} Hôn Nhân`,
      subtext: 'Liên kết Nội - Ngoại',
      icon: '💍',
      variant: 'pink',
      badge: 'Thông gia',
    },
    {
      id: 4,
      title: 'Sự Kiện & Ngày Giỗ',
      value: `${eventsCount} Sự Kiện`,
      subtext: 'Lịch sự kiện',
      icon: '📅',
      variant: 'amber',
      badge: 'Lịch giỗ',
    },
  ];

  return (
    <div className="stats-overview-grid">
      {stats.map((stat) => (
        <div key={stat.id} className={`stats-overview-card ${stat.variant}`}>
          <div className={`stats-overview-bg-blob ${stat.variant}`} />

          <div className="stats-overview-card-content">
            <div className="stats-overview-card-header">
              <div className={`stats-overview-icon-box ${stat.variant}`}>{stat.icon}</div>
              <span className={`stats-overview-badge ${stat.variant}`}>{stat.badge}</span>
            </div>

            <div className="stats-overview-title">{stat.title}</div>
            <div className="stats-overview-value">{stat.value}</div>
          </div>

          <div className="stats-overview-footer">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
