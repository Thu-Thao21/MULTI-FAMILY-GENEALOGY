import React from 'react';
import familyTreeImage from '../../../assets/cay3.png';

interface AuthLandingProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

const AuthLanding: React.FC<AuthLandingProps> = ({ title, subtitle, children, backgroundImage }) => {
  return (
    <div
      className="auth-landing"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: backgroundImage
          ? `url(${backgroundImage}) no-repeat right center`
          : 'linear-gradient(135deg, #eef2ff, #dbeafe)',
        backgroundSize: backgroundImage ? 'contain' : 'cover',
        backgroundColor: '#eef2ff',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="auth-landing-grid"
        style={{
          width: '100%',
          maxWidth: '1440px',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '36px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            minHeight: '560px',
            borderRadius: '32px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            padding: '48px',
            boxShadow: '0 28px 90px rgba(15, 23, 42, 0.18)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.18,
              backgroundImage:
                'radial-gradient(circle at top left, rgba(255,255,255,0.45) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(255,255,255,0.18) 0%, transparent 30%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.28em', fontWeight: 700, opacity: 0.85, fontSize: '14px' }}>
              HỆ THỐNG GIA PHẢ LIÊN HỌ
            </p>
            <h1 style={{ margin: '16px 0 22px', fontSize: '3rem', lineHeight: 1.05, fontWeight: 800 }}>{title}</h1>
            <p style={{ margin: 0, maxWidth: '520px', fontSize: '1.05rem', lineHeight: 1.75, opacity: 0.95 }}>{subtitle}</p>
            <div style={{ marginTop: '28px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.18)', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>Gia phả</span>
              <span style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>Dòng họ</span>
              <span style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>Kết nối</span>
            </div>
            <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
              <img
                src={familyTreeImage}
                alt="Family tree"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.15)',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '560px' }}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLanding;
