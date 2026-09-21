import React, { useMemo, useState } from 'react';
import './NotificationCenterModule.css';

type NotificationCategory = 'memorial' | 'event' | 'proposal' | 'fund' | 'system' | 'security' | 'ai';
type DeliveryChannel = 'inApp' | 'email' | 'push';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface NotificationPreferences {
  masterEnabled: boolean;
  channels: Record<NotificationCategory, Record<DeliveryChannel, boolean>>;
  updatedAt: string | null;
}

const STORAGE_KEY = 'mfg-notification-preferences-v2';

const CATEGORIES: Array<{
  id: NotificationCategory;
  label: string;
  description: string;
  icon: string;
}> = [
  { id: 'memorial', label: 'Nhắc ngày giỗ', description: 'Ngày giỗ và lịch tưởng niệm sắp tới.', icon: '🕯️' },
  { id: 'event', label: 'Sự kiện gia tộc', description: 'Lịch họp, nghi lễ và thay đổi sự kiện.', icon: '📅' },
  { id: 'proposal', label: 'Đề xuất quan hệ', description: 'Kết quả duyệt hồ sơ và quan hệ.', icon: '🔗' },
  { id: 'fund', label: 'Quỹ dòng họ', description: 'Đóng góp, thu chi và xác nhận giao dịch.', icon: '💳' },
  { id: 'system', label: 'Thông báo hệ thống', description: 'Bảo trì và cập nhật dịch vụ.', icon: '⚙️' },
  { id: 'security', label: 'Bảo mật', description: 'Đăng nhập mới và thay đổi quyền truy cập.', icon: '🛡️' },
  { id: 'ai', label: 'Thông báo AI', description: 'Kết quả và cảnh báo từ tính năng AI.', icon: '✨' },
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
  masterEnabled: true,
  channels: {
    memorial: { inApp: true, email: true, push: true },
    event: { inApp: true, email: true, push: true },
    proposal: { inApp: true, email: true, push: false },
    fund: { inApp: true, email: true, push: false },
    system: { inApp: true, email: false, push: false },
    security: { inApp: true, email: true, push: true },
    ai: { inApp: true, email: false, push: false },
  },
  updatedAt: null,
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    category: 'memorial',
    title: 'Sắp đến ngày giỗ Cụ Nguyễn Văn Đức',
    content: 'Còn 3 ngày nữa là ngày giỗ chính lễ 15/08 Âm lịch tại từ đường chi trưởng.',
    createdAt: '12/09/2026 09:00',
    read: false,
  },
  {
    id: 'notif-02',
    category: 'proposal',
    title: 'Đề xuất quan hệ đã được tiếp nhận',
    content: 'Yêu cầu bổ sung quan hệ cha – con đang chờ quản trị viên dòng họ kiểm tra.',
    createdAt: '10/09/2026 15:30',
    read: false,
  },
  {
    id: 'notif-03',
    category: 'event',
    title: 'Mở đăng ký Lễ Tuyên dương Khuyến học 2026',
    content: 'Ban khuyến học bắt đầu nhận đăng ký tham dự và danh sách khen thưởng.',
    createdAt: '05/09/2026 08:00',
    read: true,
  },
  {
    id: 'notif-04',
    category: 'fund',
    title: 'Đã xác nhận khoản đóng góp',
    content: 'Khoản đóng góp 2.000.000 ₫ vào Quỹ Khuyến học đã được ghi nhận.',
    createdAt: '03/09/2026 17:45',
    read: true,
  },
  {
    id: 'notif-05',
    category: 'security',
    title: 'Phát hiện đăng nhập trên thiết bị mới',
    content: 'Tài khoản được đăng nhập từ Chrome trên macOS tại Hà Nội.',
    createdAt: '01/09/2026 10:15',
    read: false,
  },
  {
    id: 'notif-06',
    category: 'ai',
    title: 'Bản gợi ý tiểu sử đã sẵn sàng',
    content: 'AI đã hoàn tất bản nháp; dữ liệu gia phả chưa bị thay đổi.',
    createdAt: '30/08/2026 14:20',
    read: true,
  },
];

const clonePreferences = (preferences: NotificationPreferences): NotificationPreferences =>
  JSON.parse(JSON.stringify(preferences)) as NotificationPreferences;

const loadPreferences = (): NotificationPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clonePreferences(DEFAULT_PREFERENCES);
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences> | null;
    if (!parsed || typeof parsed !== 'object') return clonePreferences(DEFAULT_PREFERENCES);

    const next = clonePreferences(DEFAULT_PREFERENCES);
    if (typeof parsed.masterEnabled === 'boolean') next.masterEnabled = parsed.masterEnabled;
    CATEGORIES.forEach(({ id }) => {
      (['inApp', 'email', 'push'] as DeliveryChannel[]).forEach((channel) => {
        const value = parsed.channels?.[id]?.[channel];
        if (typeof value === 'boolean') next.channels[id][channel] = value;
      });
    });
    next.updatedAt = typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null;
    return next;
  } catch {
    return clonePreferences(DEFAULT_PREFERENCES);
  }
};

const formatUpdatedAt = (value: string | null) => {
  if (!value) return 'Chưa lưu trên thiết bị';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const NotificationCenterModule: React.FC = () => {
  const initialPreferences = useMemo(loadPreferences, []);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeCategory, setActiveCategory] = useState<'all' | NotificationCategory>('all');
  const [savedPreferences, setSavedPreferences] = useState<NotificationPreferences>(
    () => clonePreferences(initialPreferences)
  );
  const [draftPreferences, setDraftPreferences] = useState<NotificationPreferences>(
    () => clonePreferences(initialPreferences)
  );
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isDirty = useMemo(
    () => JSON.stringify(savedPreferences) !== JSON.stringify(draftPreferences),
    [draftPreferences, savedPreferences]
  );

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'unread' && notification.read) return false;
    if (activeFilter === 'read' && !notification.read) return false;
    if (activeCategory !== 'all' && notification.category !== activeCategory) return false;
    return true;
  });

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const updateChannel = (
    category: NotificationCategory,
    channel: DeliveryChannel,
    enabled: boolean
  ) => {
    setDraftPreferences((current) => ({
      ...current,
      channels: {
        ...current.channels,
        [category]: { ...current.channels[category], [channel]: enabled },
      },
    }));
    setNotice(null);
  };

  const savePreferences = () => {
    const next = { ...clonePreferences(draftPreferences), updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedPreferences(clonePreferences(next));
      setDraftPreferences(clonePreferences(next));
      setNotice({ type: 'success', text: 'Đã lưu cài đặt thông báo.' });
    } catch {
      setNotice({ type: 'error', text: 'Không thể lưu cài đặt thông báo trên trình duyệt.' });
    }
  };

  return (
    <section className="notif-center-container" aria-labelledby="notification-page-title">
      <header className="notif-center-header">
        <div>
          <span className="notif-eyebrow">THÔNG BÁO CÁ NHÂN</span>
          <h2 className="notif-center-title" id="notification-page-title">Trung tâm thông báo</h2>
          <p className="notif-center-subtitle">
            Theo dõi cập nhật gia tộc và kiểm soát riêng từng kênh nhận thông báo.
          </p>
        </div>
        <button
          className="mark-all-read-btn"
          type="button"
          onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))}
          disabled={unreadCount === 0}
        >
          ✓ Đánh dấu tất cả đã đọc ({unreadCount})
        </button>
      </header>

      {notice && (
        <div className={`notif-toast ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          <span aria-hidden="true">{notice.type === 'success' ? '✓' : '!'}</span>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Đóng thông báo">×</button>
        </div>
      )}

      <div className="notif-layout-grid">
        <article className="notif-list-card">
          <div className="notif-section-heading">
            <div>
              <h3>Hộp thư của bạn</h3>
              <p>{unreadCount} thông báo chưa đọc</p>
            </div>
          </div>

          <div className="notif-filter-bar">
            <div className="notif-filter-group" role="group" aria-label="Lọc trạng thái đọc">
              {(['all', 'unread', 'read'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`notif-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' && `Tất cả (${notifications.length})`}
                  {filter === 'unread' && `Chưa đọc (${unreadCount})`}
                  {filter === 'read' && 'Đã đọc'}
                </button>
              ))}
            </div>

            <label className="notif-category-filter">
              <span className="sr-only">Lọc loại thông báo</span>
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value as 'all' | NotificationCategory)}
              >
                <option value="all">Tất cả danh mục</option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="notif-items-list">
            {filteredNotifications.length === 0 ? (
              <div className="notif-empty">
                <span aria-hidden="true">✓</span>
                <strong>Không có thông báo phù hợp</strong>
                <p>Hãy thử một trạng thái hoặc danh mục khác.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const category = CATEGORIES.find((entry) => entry.id === item.category)!;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`notif-card-item ${item.read ? 'read' : 'unread'}`}
                    onClick={() => setNotifications((current) => current.map((notification) => (
                      notification.id === item.id ? { ...notification, read: true } : notification
                    )))}
                    aria-label={`${item.read ? '' : 'Chưa đọc. '}${item.title}`}
                  >
                    <span className="notif-item-icon" aria-hidden="true">{category.icon}</span>
                    <span className="notif-item-content">
                      <span className="notif-item-head">
                        <span className={`notif-cat-badge ${item.category}`}>{category.label}</span>
                        <span className="notif-time">{item.createdAt}</span>
                      </span>
                      <strong className="notif-item-title">{item.title}</strong>
                      <span className="notif-item-desc">{item.content}</span>
                      {!item.read && <span className="unread-label">• Chưa đọc</span>}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </article>

        <article className="notif-settings-card">
          <div className="notif-settings-head">
            <div>
              <h3>Cài đặt kênh nhận</h3>
              <p>Cập nhật: {formatUpdatedAt(savedPreferences.updatedAt)}</p>
            </div>
            <label className="notif-master-switch">
              <span>{draftPreferences.masterEnabled ? 'Đang bật' : 'Đang tắt'}</span>
              <input
                type="checkbox"
                checked={draftPreferences.masterEnabled}
                onChange={(event) => {
                  setDraftPreferences((current) => ({ ...current, masterEnabled: event.target.checked }));
                  setNotice(null);
                }}
                aria-label="Bật hoặc tắt toàn bộ thông báo"
              />
              <span aria-hidden="true" />
            </label>
          </div>

          {!draftPreferences.masterEnabled && (
            <div className="notif-disabled-note" role="status">
              Toàn bộ kênh đang tạm dừng. Lựa chọn chi tiết vẫn được giữ lại.
            </div>
          )}

          <div className="notif-matrix-scroll">
            <table className="notif-settings-matrix">
              <thead>
                <tr>
                  <th scope="col">Danh mục</th>
                  <th scope="col">Trong ứng dụng</th>
                  <th scope="col">Email</th>
                  <th scope="col">Push</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((category) => (
                  <tr key={category.id}>
                    <th scope="row">
                      <span aria-hidden="true">{category.icon}</span>
                      <span>
                        <strong>{category.label}</strong>
                        <small>{category.description}</small>
                      </span>
                    </th>
                    {(['inApp', 'email', 'push'] as DeliveryChannel[]).map((channel) => (
                      <td key={channel}>
                        <label className="notif-matrix-check">
                          <input
                            type="checkbox"
                            checked={draftPreferences.channels[category.id][channel]}
                            disabled={!draftPreferences.masterEnabled}
                            onChange={(event) => updateChannel(category.id, channel, event.target.checked)}
                            aria-label={`${category.label} qua ${channel === 'inApp' ? 'ứng dụng' : channel}`}
                          />
                          <span aria-hidden="true" />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="notif-settings-actions">
            <span className={isDirty ? 'dirty' : ''}>{isDirty ? 'Có thay đổi chưa lưu' : 'Đã lưu'}</span>
            <div>
              <button
                type="button"
                className="notif-reset-btn"
                onClick={() => {
                  setDraftPreferences(clonePreferences(DEFAULT_PREFERENCES));
                  setNotice(null);
                }}
              >
                Đặt lại mặc định
              </button>
              <button
                type="button"
                className="notif-save-btn"
                disabled={!isDirty}
                onClick={savePreferences}
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default NotificationCenterModule;
