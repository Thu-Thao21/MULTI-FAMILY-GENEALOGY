import React, { useEffect, useState } from 'react';
import { fetchFamilies, fetchMembers } from '../../../services/member.service';
import type { Family, Member } from '../../../types/member';
import './MemberList.css';

export interface MemberListProps {
  onSelectMember: (memberId: string) => void;
}

export const MemberList: React.FC<MemberListProps> = ({ onSelectMember }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFamilies().then((data) => {
      setFamilies(data);
      if (data.length > 0) {
        setSelectedFamilyId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMembers({ familyId: selectedFamilyId || undefined, search: searchTerm }).then((res) => {
      setMembers(res.items);
      setLoading(false);
    });
  }, [selectedFamilyId, searchTerm]);

  return (
    <div className="member-list-container">
      <div className="member-list-header">
        <div>
          <h2 className="member-list-title">Danh Sách Thành Viên Gia Tộc</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748b' }}>
            Tra cứu hồ sơ, thế hệ và thông tin cá nhân của các thành viên trong dòng họ.
          </p>
        </div>

        <div className="member-list-controls">
          <input
            type="text"
            className="member-search-input"
            placeholder="🔍 Tìm tên, nghề nghiệp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="member-select-filter"
            value={selectedFamilyId}
            onChange={(e) => setSelectedFamilyId(e.target.value)}
          >
            <option value="">-- Tất cả dòng họ --</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.memberCount} thành viên)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="member-table-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            🔄 Đang tải danh sách thành viên từ cơ sở dữ liệu...
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            📂 Chưa có thành viên nào phù hợp với bộ lọc.
          </div>
        ) : (
          <table className="member-table">
            <thead>
              <tr>
                <th>Thành viên</th>
                <th>Giới tính</th>
                <th>Thế hệ</th>
                <th>Chi / Nhánh</th>
                <th>Nghề nghiệp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} onClick={() => onSelectMember(m.id)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.fullName} className="member-avatar-mini" />
                      ) : (
                        <div className="member-avatar-placeholder-mini">{m.fullName.charAt(0)}</div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.fullName}</div>
                        {m.otherName && <div style={{ fontSize: '12px', color: '#94a3b8' }}>({m.otherName})</div>}
                      </div>
                    </div>
                  </td>
                  <td>{m.gender === 'male' ? 'Nam 👨' : 'Nữ 👩'}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>Đời {m.generation}</span>
                  </td>
                  <td>{m.branch || 'Chưa xếp chi'}</td>
                  <td>{m.occupation || '—'}</td>
                  <td>
                    {m.isAlive ? (
                      <span className="member-badge-alive">Còn sống</span>
                    ) : (
                      <span className="member-badge-deceased">Đã mất</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMember(m.id);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#eff6ff',
                        color: '#2563eb',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      Xem hồ sơ ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MemberList;
