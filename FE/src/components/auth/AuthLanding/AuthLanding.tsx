import React from 'react';
import familyTreeImage from '../../../assets/cay3.png';
import './AuthLanding.css';

export interface AuthLandingProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ title, subtitle, children, backgroundImage }) => {
  return (
    <div
      className="auth-landing-container"
      style={{
        background: backgroundImage
          ? `url(${backgroundImage}) no-repeat right center`
          : 'linear-gradient(135deg, #eef2ff, #dbeafe)',
        backgroundSize: backgroundImage ? 'contain' : 'cover',
      }}
    >
      <div className="auth-landing-grid">
        <div className="auth-landing-banner">
          <div className="auth-landing-banner-overlay" />
          <div className="auth-landing-banner-circle" />
          <div className="auth-landing-banner-content">
            <p className="auth-landing-tagline">HỆ THỐNG GIA PHẢ LIÊN HỌ</p>
            <h1 className="auth-landing-title">{title}</h1>
            <p className="auth-landing-subtitle">{subtitle}</p>
            <div className="auth-landing-tags">
              <span className="auth-landing-tag">Gia phả</span>
              <span className="auth-landing-tag-secondary">Dòng họ</span>
              <span className="auth-landing-tag-secondary">Kết nối</span>
            </div>
            <div className="auth-landing-image-wrapper">
              <img src={familyTreeImage} alt="Family tree" className="auth-landing-image" />
            </div>
          </div>
        </div>

        <div className="auth-landing-form-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default AuthLanding;
