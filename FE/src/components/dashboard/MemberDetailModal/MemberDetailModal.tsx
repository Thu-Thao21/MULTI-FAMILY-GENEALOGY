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
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.25)',
          border: '1px solid #e2e8f0',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            zIndex: 0,
          }}
        />

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: 'none',
            fontSize: '18px',
            fontWeight: 800,
            cursor: 'pointer',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '20px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '24px',
                backgroundColor: member.avatarBg,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                border: '4px solid #ffffff',
              }}
            >
              {member.gender === 'male' ? '👨' : '👩'}
            </div>

            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                }}
              >
                Họ {member.family} • Thế hệ {member.generation}
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
                {member.name}
              </h3>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Năm sinh: {member.birthYear}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Vai trò dòng họ:</span>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>{member.role}</span>
            </div>

            {member.spouse && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#fdf2f8' }}>
                <span style={{ color: '#be185d', fontSize: '13px' }}>Phối ngẫu (Vợ/Chồng):</span>
                <span style={{ fontWeight: 700, color: '#be185d', fontSize: '13px' }}>💍 {member.spouse}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Giới tính:</span>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
                {member.gender === 'male' ? 'Nam' : 'Nữ'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => alert(`Xem cây trực hệ của ${member.name}`)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              🌳 Xem Cây Trực Hệ
            </button>
            <button
              onClick={() => alert(`Chỉnh sửa thông tin ${member.name}`)}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
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
