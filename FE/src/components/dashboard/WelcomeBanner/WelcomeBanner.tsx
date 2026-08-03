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
      <div className="welcome-banner-bg-circle-top" />
      <div className="welcome-banner-bg-circle-bottom" />

      <div className="welcome-banner-content">
        <div className="welcome-banner-badge-row">
          <span className="welcome-banner-badge">✨ KHÔNG GIAN GIA TỘC & DÒNG HỌ</span>
        </div>

        <h1 className="welcome-banner-title">Chào mừng trở lại, {userName}! 👋</h1>

        <p className="welcome-banner-desc">
          Hệ thống gia phả đa dòng họ giúp quản lý, lưu giữ phả hệ trực hệ và gắn kết thông gia giữa các dòng họ Việt Nam.
        </p>

        <div className="welcome-banner-actions">
          <button onClick={onExploreTree} className="welcome-banner-btn-primary">
            <span>🌳</span>
            <span>Xem Cây Gia Phả</span>
          </button>

          <button onClick={onAddMember} className="welcome-banner-btn-secondary">
            <span>➕</span>
            <span>Thêm Thành Viên</span>
          </button>
        </div>
      </div>

      <div className="welcome-banner-image-container">
        <div className="welcome-banner-image-wrapper">
          <img src={treeImage} alt="Family Tree Art" className="welcome-banner-image" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
