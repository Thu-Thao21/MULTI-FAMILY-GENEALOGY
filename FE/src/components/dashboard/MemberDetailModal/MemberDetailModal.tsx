import React from 'react';
import type { TreeMember } from '../FamilyTreePreview';
import './MemberDetailModal.css';

export interface MemberDetailModalProps {
  member: TreeMember | null;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="member-modal-overlay" onClick={onClose}>
      <div className="member-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="member-modal-banner-bg" />

        <button onClick={onClose} className="member-modal-close-btn">
          ✕
        </button>

        <div className="member-modal-content">
          <div className="member-modal-header-row">
            <div className="member-modal-avatar" style={{ backgroundColor: member.avatarBg }}>
              {member.gender === 'male' ? '👨' : '👩'}
            </div>

            <div>
              <span className="member-modal-family-tag">
                Họ {member.family} • Thế hệ {member.generation}
              </span>
              <h3 className="member-modal-name">{member.name}</h3>
              <div className="member-modal-birth">Năm sinh: {member.birthYear}</div>
            </div>
          </div>

          <div className="member-modal-details-list">
            <div className="member-modal-detail-row">
              <span className="member-modal-detail-label">Vai trò dòng họ:</span>
              <span className="member-modal-detail-val">{member.role}</span>
            </div>

            {member.spouse && (
              <div className="member-modal-detail-row spouse">
                <span className="member-modal-detail-label spouse">Phối ngẫu (Vợ/Chồng):</span>
                <span className="member-modal-detail-val spouse">💍 {member.spouse}</span>
              </div>
            )}

            <div className="member-modal-detail-row">
              <span className="member-modal-detail-label">Giới tính:</span>
              <span className="member-modal-detail-val">{member.gender === 'male' ? 'Nam' : 'Nữ'}</span>
            </div>
          </div>

          <div className="member-modal-actions-row">
            <button
              onClick={() => alert(`Xem cây trực hệ của ${member.name}`)}
              className="member-modal-action-primary"
            >
              🌳 Xem Cây Trực Hệ
            </button>
            <button
              onClick={() => alert(`Chỉnh sửa thông tin ${member.name}`)}
              className="member-modal-action-secondary"
            >
              ✏️ Sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
