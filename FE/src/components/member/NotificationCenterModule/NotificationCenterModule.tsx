import React, { useState } from 'react';
import './NotificationCenterModule.css';

export interface NotificationItem {
  id: string;
  category: 'anniversary' | 'event' | 'proposal' | 'network' | 'account';
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export const NotificationCenterModule: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-01',
      category: 'anniversary',
      title: 'Sắp đến ngày giỗ Cụ Nguyễn Văn A (Đời 1)',
      content: 'Còn 3 ngày nữa là đến ngày giỗ chính lễ (15/08 Âm lịch). Vui lòng kiểm tra lịch cúng tế.',
      createdAt: '12/09/2026 09:00',
      read: false,
    },
    {
      id: 'notif-02',
      category: 'proposal',
      title: 'Đề xuất chỉnh sửa hồ sơ đã được tiếp nhận',
      content: 'Yêu cầu bổ sung học vấn của bạn đã được đưa vào danh sách chờ Quản trị viên duyệt.',
      createdAt: '10/09/2026 15:30',
      read: false,
    },
    {
      id: 'notif-03',
      category: 'event',
      title: 'Mở đăng ký Lễ Tuyên dương Khuyến học 2026',
      content: 'Ban khuyến học dòng họ thông báo bắt đầu nhận danh sách khen thưởng học sinh đỗ đại học.',
      createdAt: '05/09/2026 08:00',
      read: true,
    },
    {
      id: 'notif-04',
      category: 'network',
      title: 'Yêu cầu liên kết dòng họ mới',
      content: 'Dòng họ Nguyễn Chi 2 tại Hải Dương vừa cập nhật phạm vi thông tin chia sẻ.',
      createdAt: '01/09/2026 10:15',
      read: true,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [channelConfig, setChannelConfig] = useState({
    anniversary: true,
    event: true,
    proposal: true,
    network: true,
    account: true,
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'unread' && n.read) return false;
    if (activeFilter === 'read' && !n.read) return false;
    if (activeCategory !== 'all' && n.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="notif-center-container">
      <div className="notif-center-header">
        <div>
          <h2 className="notif-center-title">Trung Tâm Thông Báo Cá Nhân</h2>
          <p className="notif-center-subtitle">
            Cập nhật thông báo ngày giỗ, sự kiện, đề xuất, liên họ và cài đặt kênh nhận.
          </p>
        </div>
        <button className="mark-all-read-btn" onClick={markAllAsRead}>
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="notif-layout-grid">
        {/* Left Column: Notifications List */}
        <div className="notif-list-card">
          <div className="notif-filter-bar">
            <div className="filter-group">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveFilter('unread')}
              >
                Chưa đọc ({notifications.filter((n) => !n.read).length})
              </button>
            </div>

            <select
              className="cat-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="all">-- Tất cả loại thông báo --</option>
              <option value="anniversary">Ngày giỗ</option>
              <option value="event">Sự kiện</option>
              <option value="proposal">Đề xuất</option>
              <option value="network">Mạng lưới liên họ</option>
            </select>
          </div>

          <div className="notif-items-list">
            {filteredNotifs.length === 0 ? (
              <div className="notif-empty">Không có thông báo nào phù hợp.</div>
            ) : (
              filteredNotifs.map((item) => (
                <div
                  key={item.id}
                  className={`notif-card-item ${item.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className="notif-item-head">
                    <span className={`notif-cat-badge ${item.category}`}>
                      {item.category === 'anniversary' && 'Ngày giỗ'}
                      {item.category === 'event' && 'Sự kiện'}
                      {item.category === 'proposal' && 'Đề xuất'}
                      {item.category === 'network' && 'Liên họ'}
                    </span>
                    <span className="notif-time">{item.createdAt}</span>
                  </div>

                  <h4 className="notif-item-title">{item.title}</h4>
                  <p className="notif-item-desc">{item.content}</p>

                  {!item.read && <span className="unread-dot">• Chưa đọc</span>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Settings Preferences */}
        <div className="notif-config-card">
          <h3 className="config-card-title">Cài Đặt Thông Báo</h3>
          <p className="config-card-subtitle">Bật / Tắt nhận thông báo theo từng danh mục.</p>

          <div className="config-checkboxes-list">
            <label className="notif-checkbox-label">
              <input
                type="checkbox"
                checked={channelConfig.anniversary}
                onChange={(e) => setChannelConfig({ ...channelConfig, anniversary: e.target.checked })}
              />
              Nhắc nhở ngày giỗ gia tộc
            </label>

            <label className="notif-checkbox-label">
              <input
                type="checkbox"
                checked={channelConfig.event}
                onChange={(e) => setChannelConfig({ ...channelConfig, event: e.target.checked })}
              />
              Sự kiện & Hoạt động dòng họ
            </label>

            <label className="notif-checkbox-label">
              <input
                type="checkbox"
                checked={channelConfig.proposal}
                onChange={(e) => setChannelConfig({ ...channelConfig, proposal: e.target.checked })}
              />
              Trạng thái đề xuất chỉnh sửa
            </label>

            <label className="notif-checkbox-label">
              <input
                type="checkbox"
                checked={channelConfig.network}
                onChange={(e) => setChannelConfig({ ...channelConfig, network: e.target.checked })}
              />
              Cập nhật mạng lưới liên họ
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterModule;
