import React, { useState } from 'react';
import './AnniversariesModule.css';

export interface AnniversaryItem {
  id: string;
  deceasedName: string;
  generation: number;
  lunarDate: string;
  solarDate: string;
  relation: string;
  location: string;
  isFollowing: boolean;
  daysRemaining: number;
}

export const AnniversariesModule: React.FC = () => {
  const [anniversaries, setAnniversaries] = useState<AnniversaryItem[]>([
    {
      id: 'anniv-001',
      deceasedName: 'Cụ Nguyễn Văn A',
      generation: 1,
      lunarDate: '15 tháng 8 Âm lịch',
      solarDate: '24/09/2026',
      relation: 'Cụ tổ khởi nghiệp Chi 1',
      location: 'Nhà thờ họ Nguyễn, Làng Đông, Xã Kim Liên',
      isFollowing: true,
      daysRemaining: 11,
    },
    {
      id: 'anniv-002',
      deceasedName: 'Bà Nguyễn Thị B',
      generation: 2,
      lunarDate: '02 tháng 10 Âm lịch',
      solarDate: '10/11/2026',
      relation: 'Bà nội',
      location: 'Nhà trưởng tộc Nguyễn Văn C, Từ Liêm, Hà Nội',
      isFollowing: true,
      daysRemaining: 58,
    },
    {
      id: 'anniv-003',
      deceasedName: 'Ông Nguyễn Văn C',
      generation: 3,
      lunarDate: '20 tháng 11 Âm lịch',
      solarDate: '28/12/2026',
      relation: 'Ông chú họ',
      location: 'Từ đường chi nhánh Hải Phòng',
      isFollowing: false,
      daysRemaining: 106,
    },
  ]);

  const [reminderConfig, setReminderConfig] = useState({
    before3Days: true,
    before1Day: true,
    onDay: true,
    channelEmail: true,
    channelApp: true,
  });

  const [showConfigModal, setShowConfigModal] = useState(false);

  const toggleFollow = (id: string) => {
    setAnniversaries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFollowing: !item.isFollowing } : item))
    );
  };

  return (
    <div className="anniv-container">
      <div className="anniv-header">
        <div>
          <h2 className="anniv-title">Lịch Ngày Giỗ & Tưởng Niệm Gia Tộc</h2>
          <p className="anniv-subtitle">
            Theo dõi danh sách ngày giỗ Âm/Dương lịch và cấu hình nhận thông báo nhắc nhở tự động.
          </p>
        </div>
        <button className="anniv-config-btn" onClick={() => setShowConfigModal(true)}>
          ⚙️ Cấu hình nhận nhắc giỗ
        </button>
      </div>

      <div className="anniv-grid">
        {anniversaries.map((item) => (
          <div key={item.id} className="anniv-card">
            <div className="anniv-card-top">
              <div className="anniv-days-badge">
                Còn <strong style={{ fontSize: '18px' }}>{item.daysRemaining}</strong> ngày
              </div>
              <button
                className={`follow-btn ${item.isFollowing ? 'following' : ''}`}
                onClick={() => toggleFollow(item.id)}
              >
                {item.isFollowing ? '★ Đang theo dõi' : '☆ Theo dõi'}
              </button>
            </div>

            <h3 className="anniv-name">{item.deceasedName}</h3>
            <div className="anniv-relation">
              <span>Thế hệ: Đời thứ {item.generation}</span> • <span>Quan hệ: {item.relation}</span>
            </div>

            <div className="anniv-date-box">
              <div className="date-item lunar">
                <span className="date-label">Âm lịch:</span>
                <span className="date-val">{item.lunarDate}</span>
              </div>
              <div className="date-item solar">
                <span className="date-label">Dương lịch dự kiến:</span>
                <span className="date-val">{item.solarDate}</span>
              </div>
            </div>

            <div className="anniv-location">
              📍 <strong>Địa điểm cúng giỗ:</strong> {item.location}
            </div>
          </div>
        ))}
      </div>

      {showConfigModal && (
        <div className="anniv-modal-overlay">
          <div className="anniv-modal-card">
            <h3 className="anniv-modal-title">Cấu hình Nhắc Lịch Giỗ</h3>
            <p className="anniv-modal-subtitle">Lựa chọn thời điểm và phương thức nhận thông báo cá nhân hóa.</p>

            <div className="config-group">
              <h4 className="config-section-label">Thời điểm nhắc nhở</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={reminderConfig.before3Days}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, before3Days: e.target.checked })}
                />
                Nhắc trước 3 ngày giỗ
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={reminderConfig.before1Day}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, before1Day: e.target.checked })}
                />
                Nhắc trước 1 ngày giỗ
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={reminderConfig.onDay}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, onDay: e.target.checked })}
                />
                Nhắc vào đúng sáng ngày giỗ
              </label>
            </div>

            <div className="config-group" style={{ marginTop: '16px' }}>
              <h4 className="config-section-label">Kênh nhận thông báo</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={reminderConfig.channelApp}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, channelApp: e.target.checked })}
                />
                Thông báo trong Ứng dụng (TopBar & Notification Center)
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={reminderConfig.channelEmail}
                  onChange={(e) => setReminderConfig({ ...reminderConfig, channelEmail: e.target.checked })}
                />
                Gửi Email nhắc nhở tới tài khoản
              </label>
            </div>

            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button className="modal-submit-btn" onClick={() => setShowConfigModal(false)}>
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnniversariesModule;
