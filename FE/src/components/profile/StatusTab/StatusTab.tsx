import React from 'react';
import type { MemberDetail } from '../../../types/member';
import '../Profile.css';
import './StatusTab.css';

export interface StatusTabProps {
  member: MemberDetail;
}

export const StatusTab: React.FC<StatusTabProps> = ({ member }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className={`profile-card ${member.isAlive ? 'status-alive-card' : 'status-deceased-card'}`}>
        <h3 className="profile-card-title">
          {member.isAlive ? '🟢 Trạng Thái: Đang Sinh Sống' : '🕯️ Trạng Thái: Đã Qua Đời (Tưởng Niệm)'}
        </h3>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Trạng thái sinh tử</span>
            <span className="profile-info-value" style={{ fontWeight: 800 }}>
              {member.isAlive ? 'Còn sống' : 'Đã tạ thế'}
            </span>
          </div>

          {!member.isAlive && (
            <>
              <div className="profile-info-item">
                <span className="profile-info-label">Ngày mất (Dương lịch)</span>
                <span className="profile-info-value">{member.deathDate || 'Chưa cập nhật'}</span>
              </div>

              <div className="profile-info-item">
                <span className="profile-info-label">Ngày giỗ (Âm lịch)</span>
                <span className="profile-info-value" style={{ color: '#dc2626', fontWeight: 800 }}>
                  {member.lunarDeathDate || 'Chưa cập nhật'}
                </span>
              </div>

              <div className="profile-info-item" style={{ gridColumn: '1 / -1' }}>
                <span className="profile-info-label">Nơi an táng / Mộ phần</span>
                <span className="profile-info-value">{member.burialPlace || 'Chưa cập nhật vị trí mộ phần'}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusTab;
