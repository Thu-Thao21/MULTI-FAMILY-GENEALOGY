import React from 'react';

interface PersonalizedOverviewProps {
  userName: string;
  familyBranch?: string;
  generationLevel?: string;
  totalMembers?: number;
  linkedFamiliesCount?: number;
}

export const PersonalizedOverview: React.FC<PersonalizedOverviewProps> = ({
  userName,
  familyBranch = 'Họ Nguyễn (Chi Trưởng)',
  generationLevel = 'Đời thứ 7',
  totalMembers = 128,
  linkedFamiliesCount = 4,
}) => {
  const metricCards = [
    {
      id: 1,
      title: 'Dòng họ chính của bạn',
      value: familyBranch,
      subtext: 'Trực hệ chính tộc',
      tag: 'Chính Tộc',
    },
    {
      id: 2,
      title: 'Thế hệ / Đời thứ',
      value: generationLevel,
      subtext: 'Vị trí trong cây trực hệ',
      tag: 'Hiện tại',
    },
    {
      id: 3,
      title: 'Tổng số thành viên',
      value: `${totalMembers} Thành viên`,
      subtext: '68 Nam • 60 Nữ',
      tag: 'Gia phả',
    },
    {
      id: 4,
      title: 'Số dòng họ đã liên kết',
      value: `${linkedFamiliesCount} Dòng họ`,
      subtext: 'Nội • Ngoại • Thông gia',
      tag: 'Mạng lưới',
    },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Elegant Greeting Banner */}
      <div
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '32px 36px',
          boxShadow: '0 12px 32px rgba(37, 99, 235, 0.15)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '10px',
            }}
          >
            HỆ THỐNG GIA PHẢ LIÊN HỌ
          </div>
          <h1
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              margin: '0 0 8px',
              lineHeight: 1.2,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Xin chào {userName}, chúc bạn một ngày an lành!
          </h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, maxWidth: '620px', lineHeight: 1.5 }}>
            Chào mừng bạn quay trở lại với không gian gia tộc <strong>{familyBranch}</strong> thuộc <strong>{generationLevel}</strong>.
          </p>
        </div>
      </div>

      {/* 4 Clean Minimal Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
        }}
      >
        {metricCards.map((card) => (
          <div
            key={card.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '20px 22px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{card.title}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    padding: '3px 9px',
                    borderRadius: '999px',
                  }}
                >
                  {card.tag}
                </span>
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {card.value}
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '12px',
                color: '#94a3b8',
                fontWeight: 500,
              }}
            >
              {card.subtext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
