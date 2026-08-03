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
  members?: TreeMember[];
  onSelectMember?: (member: TreeMember) => void;
}

export const FamilyTreePreview: React.FC<FamilyTreePreviewProps> = ({ members = [], onSelectMember }) => {
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('ALL');

  const familiesList = Array.from(new Set(members.map((m) => m.family))).filter(Boolean);

  const filteredMembers = members.filter((m) => {
    if (selectedFamilyFilter === 'ALL') return true;
    return m.family === selectedFamilyFilter;
  });

  const gen1 = filteredMembers.filter((m) => m.generation === 1);
  const gen2 = filteredMembers.filter((m) => m.generation === 2);
  const gen3 = filteredMembers.filter((m) => m.generation === 3);

  return (
    <div className="family-tree-preview-card">
      <div className="family-tree-preview-header">
        <div>
          <div className="family-tree-preview-title-row">
            <span style={{ fontSize: '24px' }}>🌳</span>
            <h2 className="family-tree-preview-title">Sơ Đồ Phả Hệ Trực Hệ</h2>
          </div>
          <p className="family-tree-preview-desc">
            Trực quan hóa cây gia phả kết nối các dòng họ qua nhiều thế hệ & mối quan hệ hôn nhân.
          </p>
        </div>

        {familiesList.length > 0 && (
          <div className="family-tree-filter-bar">
            <button
              onClick={() => setSelectedFamilyFilter('ALL')}
              className={`family-tree-filter-btn ${selectedFamilyFilter === 'ALL' ? 'active' : ''}`}
            >
              🌐 Tất cả
            </button>
            {familiesList.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFamilyFilter(f)}
                className={`family-tree-filter-btn ${selectedFamilyFilter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {members.length === 0 ? (
        <div className="family-tree-empty-box">
          <div className="family-tree-empty-icon">🌳</div>
          <div className="family-tree-empty-title">Chưa có dữ liệu cây gia phả</div>
          <div className="family-tree-empty-desc">
            Hãy khởi tạo dòng họ và thêm thành viên đầu tiên để xem sơ đồ trực hệ.
          </div>
        </div>
      ) : (
        <div className="family-tree-gen-container">
          {gen1.length > 0 && (
            <div>
              <div className="family-tree-gen-header">
                <span className="family-tree-gen-badge gen1">👑 THẾ HỆ 1 — KHỞI NGUỒN DÒNG HỌ</span>
                <span className="family-tree-gen-line" />
              </div>

              <div className="family-tree-nodes-row">
                {gen1.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember && onSelectMember(member)}
                    className="family-tree-node-card gen1"
                  >
                    <div className="family-tree-node-inner">
                      <div className="family-tree-node-avatar gen1">{member.name.charAt(0)}</div>
                      <div>
                        <div className="family-tree-node-name">{member.name}</div>
                        <div className="family-tree-node-meta">
                          {member.family} • Sinh năm {member.birthYear || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gen2.length > 0 && (
            <div>
              <div className="family-tree-gen-header">
                <span className="family-tree-gen-badge gen2">🌱 THẾ HỆ 2 — PHÁT TRIỂN & TRƯỞNG THÀNH</span>
                <span className="family-tree-gen-line" />
              </div>

              <div className="family-tree-nodes-row">
                {gen2.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember && onSelectMember(member)}
                    className="family-tree-node-card gen2"
                  >
                    <div className="family-tree-node-inner">
                      <div className="family-tree-node-avatar gen2">{member.name.charAt(0)}</div>
                      <div>
                        <div className="family-tree-node-name">{member.name}</div>
                        <div className="family-tree-node-meta">
                          {member.family} • Sinh năm {member.birthYear || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gen3.length > 0 && (
            <div>
              <div className="family-tree-gen-header">
                <span className="family-tree-gen-badge gen3">🌿 THẾ HỆ 3 — THẾ HỆ HẬU DUỆ KẾ THỪA</span>
                <span className="family-tree-gen-line" />
              </div>

              <div className="family-tree-nodes-row">
                {gen3.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember && onSelectMember(member)}
                    className="family-tree-node-card gen3"
                  >
                    <div className="family-tree-node-inner">
                      <div className="family-tree-node-avatar gen3">{member.name.charAt(0)}</div>
                      <div>
                        <div className="family-tree-node-name">{member.name}</div>
                        <div className="family-tree-node-meta">
                          {member.family} • Sinh năm {member.birthYear || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyTreePreview;
