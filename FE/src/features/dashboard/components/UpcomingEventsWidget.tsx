import React from 'react';

export const UpcomingEventsWidget: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Giỗ Tổ Họ Nguyễn (Đời 1)',
      date: '10/08/2026',
      countdown: 'Còn 3 ngày',
      location: 'Nhà Thờ Tổ Họ Nguyễn',
      family: 'Họ Nguyễn',
    },
    {
      id: 2,
      title: 'Lễ Mừng Thọ Cụ Trần Thị Huệ (84 Tuổi)',
      date: '18/08/2026',
      countdown: 'Còn 11 ngày',
      location: 'Họ Trần - Chi 2',
      family: 'Họ Trần',
    },
    {
      id: 3,
      title: 'Họp Mặt Thông Gia Đầu Năm Họ Lê - Nguyễn',
      date: '25/08/2026',
      countdown: 'Còn 18 ngày',
      location: 'Trung tâm Gia tộc',
      family: 'Họ Lê',
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
          Sự Kiện & Ngày Giỗ Sắp Tới
        </h3>
        <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Xem tất cả</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                }}
              >
                {event.family}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {event.countdown}
              </span>
            </div>

            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{event.title}</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
              <span>Ngày: {event.date}</span>
              <span>Địa điểm: {event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
