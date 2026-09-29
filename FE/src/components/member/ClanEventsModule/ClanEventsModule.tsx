import React, { useState } from 'react';
import './ClanEventsModule.css';

export interface ClanEventItem {
  id: string;
  title: string;
  type: 'meeting' | 'ceremony' | 'scholarship' | 'trip';
  date: string;
  time: string;
  location: string;
  description: string;
  registered: boolean;
  participantCount: number;
  albumPhotos: string[];
}

export const ClanEventsModule: React.FC = () => {
  const [events, setEvents] = useState<ClanEventItem[]>([
    {
      id: 'event-001',
      title: 'Đại Hội Dòng Họ Nguyễn Lần Thứ V (2026)',
      type: 'meeting',
      date: '15/10/2026',
      time: '08:00 - 12:00',
      location: 'Hội trường Nhà thờ tổ, Chi 1, Hà Nội',
      description: 'Họp đại biểu dòng họ tổng kết hoạt động 5 năm, bầu Hội đồng gia tộc khóa mới.',
      registered: true,
      participantCount: 142,
      albumPhotos: ['Ảnh đại hội 2021', 'Sơ đồ tổ chức', 'Trao kỷ niệm chương'],
    },
    {
      id: 'event-002',
      title: 'Lễ Trao Quỹ Khuyến Học & Tuyên Dương Học Sinh Giỏi',
      type: 'scholarship',
      date: '02/09/2026',
      time: '09:00 - 11:30',
      location: 'Từ đường chi họ Hải Dương',
      description: 'Tuyên dương khen thưởng các con cháu đạt giải quốc gia, đỗ đại học năm học 2025-2026.',
      registered: false,
      participantCount: 68,
      albumPhotos: ['Lễ trao giải năm ngoái', 'Danh sách khen thưởng'],
    },
    {
      id: 'event-003',
      title: 'Lễ Tảo Mộ & Viếng Nghĩa Trang Gia Tộc Đầu Xuân',
      type: 'ceremony',
      date: '10/02/2026',
      time: '07:30 - 11:00',
      location: 'Khu công viên nghĩa trang tộc họ Nguyễn',
      description: 'Hoạt động thường niên dọn dẹp thắp hương các phần mộ tổ tiên nhân dịp đầu xuân.',
      registered: true,
      participantCount: 95,
      albumPhotos: ['Album lễ tảo mộ 2025'],
    },
  ]);

  const [selectedAlbumEvent, setSelectedAlbumEvent] = useState<ClanEventItem | null>(null);

  const toggleRegister = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextState = !ev.registered;
          return {
            ...ev,
            registered: nextState,
            participantCount: nextState ? ev.participantCount + 1 : ev.participantCount - 1,
          };
        }
        return ev;
      })
    );
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2 className="events-title">Sự Kiện Dòng Họ & Album Hoạt Động</h2>
        <p className="events-subtitle">
          Xem thông tin giỗ tổ, họp họ, tảo mộ, tuyên dương khuyến học và đăng ký tham gia.
        </p>
      </div>

      <div className="events-grid">
        {events.map((ev) => (
          <div key={ev.id} className="event-card">
            <div className="event-card-head">
              <span className={`event-type-pill ${ev.type}`}>
                {ev.type === 'meeting' && 'Họp dòng họ'}
                {ev.type === 'scholarship' && 'Khuyến học'}
                {ev.type === 'ceremony' && 'Lễ nghi / Tảo mộ'}
              </span>
              <span className="participant-count">{ev.participantCount} Đã đăng ký</span>
            </div>

            <h3 className="event-item-title">{ev.title}</h3>
            <p className="event-desc">{ev.description}</p>

            <div className="event-details">
              <div className="detail-row">
                <span><strong>Thời gian:</strong> {ev.date} ({ev.time})</span>
              </div>
              <div className="detail-row">
                <span><strong>Địa điểm:</strong> {ev.location}</span>
              </div>
            </div>

            <div className="event-actions">
              <button
                className={`register-event-btn ${ev.registered ? 'registered' : ''}`}
                onClick={() => toggleRegister(ev.id)}
              >
                {ev.registered ? 'Đã đăng ký (Nhấp để hủy)' : 'Đăng ký tham gia'}
              </button>

              {ev.albumPhotos && ev.albumPhotos.length > 0 && (
                <button
                  className="album-view-btn"
                  onClick={() => setSelectedAlbumEvent(ev)}
                >
                  Xem Album ({ev.albumPhotos.length})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Album Modal */}
      {selectedAlbumEvent && (
        <div className="album-modal-overlay">
          <div className="album-modal-card">
            <div className="album-modal-header">
              <h3>Album Tư Liệu Ảnh/Video: {selectedAlbumEvent.title}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedAlbumEvent(null)}>✕</button>
            </div>
            <div className="album-gallery">
              {selectedAlbumEvent.albumPhotos.map((photo, idx) => (
                <div key={idx} className="album-photo-item">
                  <div className="photo-placeholder">{photo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanEventsModule;
