import React from 'react';

interface CoreFeaturesGridProps {
  onNavigate: (tabId: string) => void;
}

export const CoreFeaturesGrid: React.FC<CoreFeaturesGridProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'tree',
      title: 'Cây Gia Phả Liên Họ',
      subtitle: 'Xem sơ đồ cây trực hệ, thế hệ & mối quan hệ hôn nhân nội ngoại.',
      icon: '🌳',
      badge: 'Trực quan',
      gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      iconBg: '#2563eb',
      textColor: '#1d4ed8',
    },
    {
      id: 'families',
      title: 'Danh Sách Dòng Họ',
      subtitle: 'Quản lý thông tin gia tộc Họ Nguyễn, Họ Trần, Họ Lê, Họ Phạm...',
      icon: '⛩️',
      badge: '4 Dòng họ',
      gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      iconBg: '#7c3aed',
      textColor: '#6d28d9',
    },
    {
      id: 'network',
      title: 'Mạng Lưới Liên Kết',
      subtitle: 'Tra cứu các mối quan hệ thông gia, dâu rể giữa các cây gia phả.',
      icon: '🔗',
      badge: '18 Hôn nhân',
      gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)',
      iconBg: '#ec4899',
      textColor: '#be185d',
    },
    {
      id: 'finder',
      title: 'Tra Cứu Cách Xưng Hô',
      subtitle: 'Xác định nhanh danh xưng hàng xóm, họ hàng chuẩn truyền thống.',
      icon: '✨',
      badge: 'Thông minh',
      gradient: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
      iconBg: '#10b981',
      textColor: '#047857',
    },
  ];

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Chức Năng Chính
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          Lựa chọn các không gian làm việc và tra cứu của gia tộc.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {features.map((item) => (
          <div
            key={item.id}
            className="card-hover-effect"
            onClick={() => onNavigate(item.id)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '18px',
                    backgroundColor: item.iconBg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.12)',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: item.textColor,
                    backgroundColor: item.gradient.includes('eff6ff') ? '#eff6ff' : '#f8fafc',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {item.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                {item.subtitle}
              </p>
            </div>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '14px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: item.textColor,
                fontWeight: 700,
                fontSize: '13.5px',
              }}
            >
              <span>Truy cập ngay</span>
              <span style={{ fontSize: '16px' }}>➔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
