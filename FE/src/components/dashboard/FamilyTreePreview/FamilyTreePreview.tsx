import React, { useState } from 'react';
import './FamilyTreePreview.css';

export interface TreeMember {
  id: string;
  name: string;
  family: string;
  generation: number;
  gender: 'male' | 'female';
  birthYear: string;
  role: string;
  avatarBg: string;
  spouse?: string;
  childrenCount?: number;
  isMainRoot?: boolean;
}

export interface FamilyTreePreviewProps {
  onSelectMember: (member: TreeMember) => void;
}

export const FamilyTreePreview: React.FC<FamilyTreePreviewProps> = ({ onSelectMember }) => {
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<'ALL' | 'NGUYEN' | 'TRAN' | 'LE'>('ALL');

  const familyTheme: Record<string, { bg: string; text: string; border: string; accent: string; badgeBg: string }> = {
    Nguyễn: { bg: '#ffffff', text: '#1d4ed8', border: '#bfdbfe', accent: '#2563eb', badgeBg: '#eff6ff' },
    Trần: { bg: '#ffffff', text: '#6d28d9', border: '#ddd6fe', accent: '#7c3aed', badgeBg: '#f5f3ff' },
    Lê: { bg: '#ffffff', text: '#be185d', border: '#fbcfe8', accent: '#ec4899', badgeBg: '#fdf2f8' },
    Phạm: { bg: '#ffffff', text: '#047857', border: '#a7f3d0', accent: '#10b981', badgeBg: '#ecfdf5' },
  };

  const sampleMembers: TreeMember[] = [
    { id: '1', name: 'Nguyễn Văn An', family: 'Nguyễn', generation: 1, gender: 'male', birthYear: '1938', role: 'Cụ Tổ (Họ Nguyễn)', avatarBg: '#2563eb', spouse: 'Trần Thị Huệ', childrenCount: 3, isMainRoot: true },
    { id: '2', name: 'Trần Thị Huệ', family: 'Trần', generation: 1, gender: 'female', birthYear: '1942', role: 'Cụ Bà (Bên Ngoại - Họ Trần)', avatarBg: '#7c3aed', spouse: 'Nguyễn Văn An', childrenCount: 3 },
    { id: '3', name: 'Lê Văn Phúc', family: 'Lê', generation: 1, gender: 'male', birthYear: '1940', role: 'Cụ Tổ (Họ Lê - Thông Gia)', avatarBg: '#ec4899', spouse: 'Phạm Thị Lan', childrenCount: 2 },
    { id: '4', name: 'Nguyễn Văn Bình', family: 'Nguyễn', generation: 2, gender: 'male', birthYear: '1965', role: 'Trưởng Nam (Đời 2)', avatarBg: '#2563eb', spouse: 'Lê Thị Nga', childrenCount: 2 },
    { id: '5', name: 'Lê Thị Nga', family: 'Lê', generation: 2, gender: 'female', birthYear: '1968', role: 'Con Dâu (Gốc Họ Lê)', avatarBg: '#ec4899', spouse: 'Nguyễn Văn Bình', childrenCount: 2 },
    { id: '6', name: 'Nguyễn Thị Dung', family: 'Nguyễn', generation: 2, gender: 'female', birthYear: '1970', role: 'Con Gái (Đi làm dâu Họ Trần)', avatarBg: '#2563eb', spouse: 'Trần Văn Hùng', childrenCount: 2 },
    { id: '7', name: 'Trần Văn Hùng', family: 'Trần', generation: 2, gender: 'male', birthYear: '1967', role: 'Con Rể (Trưởng Tộc Họ Trần)', avatarBg: '#7c3aed', spouse: 'Nguyễn Thị Dung', childrenCount: 2 },
    { id: '8', name: 'Nguyễn Văn Cường', family: 'Nguyễn', generation: 3, gender: 'male', birthYear: '1992', role: 'Cháu Đích Tôn (Đời 3)', avatarBg: '#2563eb', childrenCount: 0 },
    { id: '9', name: 'Nguyễn Thị Mai', family: 'Nguyễn', generation: 3, gender: 'female', birthYear: '1996', role: 'Cháu Gái (Đời 3)', avatarBg: '#2563eb', childrenCount: 0 },
    { id: '10', name: 'Trần Minh Quang', family: 'Trần', generation: 3, gender: 'male', birthYear: '1995', role: 'Cháu Ngoại (Họ Trần)', avatarBg: '#7c3aed', childrenCount: 0 },
  ];

  const filteredMembers = sampleMembers.filter((m) => {
    if (selectedFamilyFilter === 'ALL') return true;
    if (selectedFamilyFilter === 'NGUYEN') return m.family === 'Nguyễn';
    if (selectedFamilyFilter === 'TRAN') return m.family === 'Trần';
    if (selectedFamilyFilter === 'LE') return m.family === 'Lê';
    return true;
  });

  const gen1 = filteredMembers.filter((m) => m.generation === 1);
  const gen2 = filteredMembers.filter((m) => m.generation === 2);
  const gen3 = filteredMembers.filter((m) => m.generation === 3);

  return (
    <div className="family-tree-preview-card">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🌳</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Bản Đồ Gia Phả Liên Họ
            </h2>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
            Trực quan hóa cây gia phả kết nối các dòng họ qua nhiều thế hệ & mối quan hệ hôn nhân.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8fafc',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          {[
            { key: 'ALL', label: '🌐 Tất cả dòng họ' },
            { key: 'NGUYEN', label: '🔵 Họ Nguyễn' },
            { key: 'TRAN', label: '🟣 Họ Trần' },
            { key: 'LE', label: '🌸 Họ Lê' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFamilyFilter(tab.key as any)}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: selectedFamilyFilter === tab.key ? '#ffffff' : 'transparent',
                color: selectedFamilyFilter === tab.key ? '#2563eb' : '#64748b',
                fontWeight: selectedFamilyFilter === tab.key ? 800 : 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: selectedFamilyFilter === tab.key ? '0 4px 12px rgba(15,23,42,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          padding: '14px 24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #fdf2f8 100%)',
          border: '1px solid #e2e8f0',
          marginBottom: '32px',
          fontSize: '13.5px',
          color: '#334155',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8)',
        }}
      >
        <span style={{ fontWeight: 800, color: '#0f172a' }}>💞 Liên kết hôn nhân liên họ:</span>
        <span style={{ color: '#1d4ed8', fontWeight: 800, backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: '999px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          Họ Nguyễn 💖 Họ Trần
        </span>
        <span>•</span>
        <span style={{ color: '#be185d', fontWeight: 800, backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: '999px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          Họ Nguyễn 💖 Họ Lê
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', position: 'relative' }}>
        {gen1.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ padding: '6px 16px', borderRadius: '999px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em' }}>
                👑 THẾ HỆ 1 — KHỞI NGUỒN DÒNG HỌ (CỤ TỔ & CAO CỤ)
              </span>
              <span style={{ height: '1px', flex: 1, backgroundColor: '#e2e8f0' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '22px' }}>
              {gen1.map((member) => {
                const theme = familyTheme[member.family] || familyTheme['Nguyễn'];
                return (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember(member)}
                    style={{
                      width: '270px',
                      padding: '20px',
                      borderRadius: '24px',
                      backgroundColor: theme.bg,
                      border: `1.5px solid ${theme.border}`,
                      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '18px',
                          backgroundColor: theme.accent,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '22px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                        }}
                      >
                        {member.gender === 'male' ? '👨‍🦳' : '👩‍🦳'}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: theme.text, fontWeight: 700, marginTop: '2px' }}>
                          Họ {member.family} • Sinh {member.birthYear}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '12.5px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{member.role}</span>
                      {member.spouse && (
                        <span style={{ color: '#be185d', fontWeight: 700, fontSize: '12px' }}>
                          💍 {member.spouse}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '2px', height: '28px', background: 'linear-gradient(180deg, #bfdbfe 0%, #cbd5e1 100%)' }} />
        </div>

        {gen2.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ padding: '6px 16px', borderRadius: '999px', backgroundColor: '#f5f3ff', color: '#7c3aed', fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em' }}>
                🌿 THẾ HỆ 2 — CÂY CAO BÓNG MÁT (ÔNG BÀ / CHA MẸ)
              </span>
              <span style={{ height: '1px', flex: 1, backgroundColor: '#e2e8f0' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '22px' }}>
              {gen2.map((member) => {
                const theme = familyTheme[member.family] || familyTheme['Nguyễn'];
                return (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember(member)}
                    style={{
                      width: '270px',
                      padding: '20px',
                      borderRadius: '24px',
                      backgroundColor: theme.bg,
                      border: `1.5px solid ${theme.border}`,
                      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '18px',
                          backgroundColor: theme.accent,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '22px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                        }}
                      >
                        {member.gender === 'male' ? '👨‍💼' : '👩‍💼'}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: theme.text, fontWeight: 700, marginTop: '2px' }}>
                          Họ {member.family} • Sinh {member.birthYear}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '12.5px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{member.role}</span>
                      {member.spouse && (
                        <span style={{ color: '#be185d', fontWeight: 700, fontSize: '12px' }}>
                          💍 {member.spouse}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '2px', height: '28px', background: 'linear-gradient(180deg, #cbd5e1 0%, #fbcfe8 100%)' }} />
        </div>

        {gen3.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ padding: '6px 16px', borderRadius: '999px', backgroundColor: '#fdf2f8', color: '#be185d', fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em' }}>
                🌱 THẾ HỆ 3 — MẦM NON HẬU NHUỆ (CON CHÁU)
              </span>
              <span style={{ height: '1px', flex: 1, backgroundColor: '#e2e8f0' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '22px' }}>
              {gen3.map((member) => {
                const theme = familyTheme[member.family] || familyTheme['Nguyễn'];
                return (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember(member)}
                    style={{
                      width: '270px',
                      padding: '20px',
                      borderRadius: '24px',
                      backgroundColor: theme.bg,
                      border: `1.5px solid ${theme.border}`,
                      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '18px',
                          backgroundColor: theme.accent,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '22px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                        }}
                      >
                        {member.gender === 'male' ? '👦' : '👧'}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: theme.text, fontWeight: 700, marginTop: '2px' }}>
                          Họ {member.family} • Sinh {member.birthYear}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        fontSize: '12.5px',
                        color: '#475569',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{member.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTreePreview;
