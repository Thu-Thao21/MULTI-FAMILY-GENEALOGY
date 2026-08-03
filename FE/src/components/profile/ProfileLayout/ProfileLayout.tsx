import React, { useEffect, useState } from 'react';
import { fetchMemberDetail } from '../../../services/member.service';
import type { MemberDetail } from '../../../types/member';
import { AccountTab } from '../AccountTab';
import { BiographyTab } from '../BiographyTab';
import { ContactTab } from '../ContactTab';
import { ContributionsTab } from '../ContributionsTab';
import { PersonalInfoTab } from '../PersonalInfoTab';
import { PhotosTab } from '../PhotosTab';
import { StatusTab } from '../StatusTab';
import '../Profile.css';
import './ProfileLayout.css';

export interface ProfileLayoutProps {
  memberId: string;
  onBack?: () => void;
}

export type ProfileTabKey = 'personal' | 'biography' | 'contact' | 'photos' | 'contributions' | 'status' | 'account';

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ memberId, onBack }) => {
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('personal');

  useEffect(() => {
    setLoading(true);
    fetchMemberDetail(memberId).then((data) => {
      setMember(data);
      setLoading(false);
    });
  }, [memberId]);

  if (loading) {
    return (
      <div className="profile-loading-box">
        Đang tải thông tin chi tiết hồ sơ thành viên từ cơ sở dữ liệu...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="profile-not-found-box">
        <p className="profile-not-found-text">⚠️ Không tìm thấy dữ liệu hồ sơ thành viên.</p>
        {onBack && (
          <button className="profile-back-btn" onClick={onBack}>
            ← Quay lại danh sách
          </button>
        )}
      </div>
    );
  }

  const tabs: Array<{ key: ProfileTabKey; label: string; icon: string }> = [
    { key: 'personal', label: 'Thông tin cá nhân', icon: '👤' },
    { key: 'biography', label: 'Tiểu sử & Dòng thời gian', icon: '📜' },
    { key: 'contact', label: 'Thông tin liên hệ', icon: '📞' },
    { key: 'photos', label: 'Thư viện hình ảnh', icon: '🖼️' },
    { key: 'contributions', label: 'Đóng góp & Năng lực', icon: '🏅' },
    { key: 'status', label: 'Trạng thái & An táng', icon: '🕯️' },
    { key: 'account', label: 'Tài khoản hệ thống', icon: '🔐' },
  ];

  return (
    <div className="profile-layout">
      {onBack && (
        <div>
          <button className="profile-back-btn" onClick={onBack}>
            ← Quay lại danh sách thành viên
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="profile-header-card">
        <div className="profile-header-top">
          <div className="profile-avatar-wrapper">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt={member.fullName} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">{member.fullName.charAt(0)}</div>
            )}
          </div>

          <div className="profile-header-info">
            <h1 className="profile-name">
              {member.fullName}
              <span className="profile-generation-badge">Đời thứ {member.generation}</span>
            </h1>

            <div className="profile-subtext">
              <span>{member.familyName || 'Chưa chọn dòng họ'}</span>
              {member.branch && <span>• {member.branch}</span>}
              {member.subBranch && <span>• {member.subBranch}</span>}
            </div>

            <div className="profile-header-meta">
              <div className="profile-meta-item">
                💼 <strong>{member.occupation || 'Chưa cập nhật nghề nghiệp'}</strong>
              </div>
              <div className="profile-meta-item">
                🎓 <strong>{member.education || 'Chưa cập nhật học vấn'}</strong>
              </div>
              <div className="profile-meta-item">
                {member.isAlive ? '🟢 Còn sống' : '🕯️ Đã mất'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs-bar">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`profile-tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'personal' && <PersonalInfoTab member={member} />}
        {activeTab === 'biography' && <BiographyTab member={member} />}
        {activeTab === 'contact' && <ContactTab member={member} />}
        {activeTab === 'photos' && <PhotosTab member={member} />}
        {activeTab === 'contributions' && <ContributionsTab member={member} />}
        {activeTab === 'status' && <StatusTab member={member} />}
        {activeTab === 'account' && <AccountTab member={member} />}
      </div>
    </div>
  );
};

export default ProfileLayout;
