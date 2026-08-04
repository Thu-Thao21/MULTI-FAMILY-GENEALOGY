import React from 'react';
import type { MemberDetail } from '../../../types/member';
import '../Profile.css';
import './AccountTab.css';

export interface AccountTabProps {
  member: MemberDetail;
}

export const AccountTab: React.FC<AccountTabProps> = ({ member }) => {
  return (
    <div className="account-tab-container">
      <div className="profile-card">
        <h3 className="profile-card-title">Tài Khoản Người Dùng Liên Kết</h3>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Mã tài khoản (User ID)</span>
            <span className="profile-info-value">{member.userId || 'Chưa liên kết tài khoản hệ thống'}</span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Quyền hạn gia tộc</span>
            <span className="profile-info-value account-role-text">
              {member.isPrimary ? 'Chủ dòng họ / Quản trị gia phả' : 'Thành viên gia tộc'}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Trạng thái tài khoản</span>
            <div>
              <span className="account-status-badge">🟢 Đã kích hoạt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
