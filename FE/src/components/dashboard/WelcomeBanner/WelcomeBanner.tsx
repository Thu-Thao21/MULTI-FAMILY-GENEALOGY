import React from 'react';
import treeImage from '../../../assets/pngtree-family-tree-with-relatives-and-relationship.png';
import './WelcomeBanner.css';

export interface WelcomeBannerProps {
  userName: string;
  onExploreTree: () => void;
  onAddMember: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName, onExploreTree, onAddMember }) => {
  return (
    <div className="welcome-banner-card">
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '15%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(12px)',
              fontSize: '12.5px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            ✨ KHÔNG GIAN GIA TỘC & DÒNG HỌ
          </span>
        </div>

        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            margin: '0 0 14px',
            lineHeight: 1.15,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Chào mừng trở lại, {userName}! 👋
        </h1>

        <p style={{ fontSize: '1.08rem', lineHeight: 1.65, opacity: 0.94, margin: '0 0 28px', maxWidth: '600px' }}>
          Hệ thống đang lưu giữ và kết nối gia phả của <strong>4 dòng họ lớn</strong> (Họ Nguyễn, Họ Trần, Họ Lê, Họ Phạm) với{' '}
          <strong>128 thành viên</strong> qua <strong>18 mối liên kết hôn nhân liên họ</strong>.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <button
            onClick={onExploreTree}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              border: 'none',
              borderRadius: '18px',
              padding: '16px 28px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 14px 32px rgba(0, 0, 0, 0.16)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <span>🌳</span>
            <span>Xem Cây Gia Phả</span>
          </button>

          <button
            onClick={onAddMember}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(12px)',
              borderRadius: '18px',
              padding: '16px 28px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            <span>➕</span>
            <span>Thêm Thành Viên</span>
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '14px',
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.28)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
          }}
        >
          <img
            src={treeImage}
            alt="Family Tree Art"
            style={{
              maxHeight: '220px',
              objectFit: 'contain',
              borderRadius: '20px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
