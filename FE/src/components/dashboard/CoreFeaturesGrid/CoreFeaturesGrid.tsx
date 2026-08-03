import React from 'react';
import './CoreFeaturesGrid.css';

export interface CoreFeaturesGridProps {
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
      subtitle: 'Quản lý thông tin gia tộc và phả hệ các dòng họ...',
      icon: '⛩️',
      badge: 'Quản lý dòng họ',
      gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      iconBg: '#7c3aed',
      textColor: '#6d28d9',
    },
    {
      id: 'network',
      title: 'Mạng Lưới Liên Kết',
      subtitle: 'Tra cứu các mối quan hệ thông gia, dâu rể giữa các cây gia phả.',
      icon: '🔗',
      badge: 'Mạng lưới liên kết',
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
    <div className="core-features-wrapper">
      <div className="core-features-header">
        <h2 className="core-features-title">Chức Năng Chính</h2>
        <p className="core-features-desc">Lựa chọn các không gian làm việc và tra cứu của gia tộc.</p>
      </div>

      <div className="core-features-grid">
        {features.map((item) => (
          <div key={item.id} className="core-features-card" onClick={() => onNavigate(item.id)}>
            <div>
              <div className="core-features-card-top">
                <div className="core-features-icon-box" style={{ backgroundColor: item.iconBg }}>
                  {item.icon}
                </div>
                <span
                  className="core-features-badge"
                  style={{
                    color: item.textColor,
                    backgroundColor: item.gradient.includes('eff6ff') ? '#eff6ff' : '#f8fafc',
                  }}
                >
                  {item.badge}
                </span>
              </div>

              <h3 className="core-features-item-title">{item.title}</h3>
              <p className="core-features-item-subtitle">{item.subtitle}</p>
            </div>

            <div className="core-features-card-footer" style={{ color: item.textColor }}>
              <span>Truy cập ngay</span>
              <span>➔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoreFeaturesGrid;
