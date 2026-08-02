import React from 'react';
import './StatsOverview.css';

export const StatsOverview: React.FC = () => {
  const stats = [
    {
      id: 1,
      title: 'Dòng Họ Liên Kết',
      value: '4 Dòng Họ',
      subtext: 'Nguyễn, Trần, Lê, Phạm',
      icon: '⛩️',
      color: '#2563eb',
      bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      borderColor: 'rgba(37, 99, 235, 0.2)',
      badge: '+1 Họ mới kết nối',
    },
    {
      id: 2,
      title: 'Tổng Thành Viên',
      value: '128 Người',
      subtext: '68 Nam • 60 Nữ',
      icon: '👥',
      color: '#7c3aed',
      bgGradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      borderColor: 'rgba(124, 58, 237, 0.2)',
      badge: '5 Thế hệ trực hệ',
    },
    {
      id: 3,
      title: 'Quan Hệ Hôn Nhân',
      value: '18 Cuộc Hôn Nhân',
      subtext: 'Liên kết Nội - Ngoại - Thông gia',
      icon: '💍',
      color: '#ec4899',
      bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      borderColor: 'rgba(236, 72, 153, 0.2)',
      badge: '100% Đã xác thực',
    },
    {
      id: 4,
      title: 'Sự Kiện & Ngày Giỗ',
      value: '5 Sự Kiện',
      subtext: 'Trong tháng này (Tháng 8)',
      icon: '📅',
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
      badge: 'Sắp tới: Giỗ Tổ Nguyễn',
    },
  ];

  return (
    <div className="stats-overview-grid">
      {stats.map((stat) => (
        <div
          key={stat.id}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '22px 24px',
            border: `1px solid ${stat.borderColor}`,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: stat.bgGradient,
              opacity: 0.6,
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: stat.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                {stat.icon}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: stat.color,
                  backgroundColor: `${stat.color}15`,
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                {stat.badge}
              </span>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              {stat.title}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {stat.value}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
              fontSize: '12px',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            {stat.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
