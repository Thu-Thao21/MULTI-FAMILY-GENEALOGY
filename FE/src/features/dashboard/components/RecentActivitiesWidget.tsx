import React from 'react';

export const RecentActivitiesWidget: React.FC = () => {
  const activities = [
    {
      id: 1,
      user: 'Nguyễn Văn Bình',
      action: 'đã bổ sung tiểu sử cho cụ Nguyễn Văn An',
      time: '15 phút trước',
    },
    {
      id: 2,
      user: 'Trần Văn Hùng',
      action: 'đã cập nhật thông tin liên kết hôn nhân Họ Trần & Họ Nguyễn',
      time: '1 giờ trước',
    },
    {
      id: 3,
      user: 'Lê Thị Nga',
      action: 'đã cập nhật hình ảnh chân dung gia phả',
      time: '3 giờ trước',
    },
    {
      id: 4,
      user: 'Quản trị viên',
      action: 'đã phê duyệt 5 hồ sơ thành viên mới dòng Họ Lê',
      time: 'Hôm qua',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Hoạt Động Gần Đây
        </h3>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Cập nhật nhật ký</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activities.map((act) => (
          <div
            key={act.id}
            style={{
              paddingBottom: '12px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
              <strong style={{ color: '#0f172a', fontWeight: 700 }}>{act.user}</strong> {act.action}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{act.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
