import React from 'react';
import './UpcomingEventsWidget.css';

export interface UpcomingEventItem {
  id: number | string;
  title: string;
  date: string;
  countdown: string;
  location: string;
  family: string;
}

export interface UpcomingEventsWidgetProps {
  events?: UpcomingEventItem[];
}

export const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ events = [] }) => {
  return (
    <div className="upcoming-events-card">
      <div className="upcoming-events-header">
        <h3 className="upcoming-events-title">Sự Kiện & Ngày Giỗ Sắp Tới</h3>
        <span className="upcoming-events-subtitle">Lịch gia tộc</span>
      </div>

      <div className="upcoming-events-list">
        {events.length === 0 ? (
          <div className="upcoming-events-empty">Chưa có sự kiện hoặc ngày giỗ nào được lưu.</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="upcoming-events-item">
              <div className="upcoming-events-item-top">
                <span className="upcoming-events-family-badge">{event.family}</span>
                <span className="upcoming-events-countdown-badge">{event.countdown}</span>
              </div>

              <div className="upcoming-events-item-title">{event.title}</div>

              <div className="upcoming-events-item-meta">
                <span>Ngày: {event.date}</span>
                <span>Địa điểm: {event.location}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsWidget;
