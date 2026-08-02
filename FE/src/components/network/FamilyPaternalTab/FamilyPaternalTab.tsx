import React, { useEffect, useState } from 'react';
import { fetchFamilyNetwork } from '../../../services/network.service';
import type { FamilyNetwork } from '../../../types/network';
import '../Network.css';
import './FamilyPaternalTab.css';

export const FamilyPaternalTab: React.FC = () => {
  const [families, setFamilies] = useState<FamilyNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyNetwork('noi').then((data) => {
      setFamilies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu Dòng họ Nội...</div>;

  return (
    <div className="network-layout">
      <div className="network-card">
        <h3 className="network-card-title">Dòng Họ Nội (Bên Cha)</h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 20px' }}>
          Các dòng họ thuộc bên nội cha, bao gồm dòng họ gốc và các chi nhánh trực hệ.
        </p>
        {families.length > 0 ? (
          <div className="network-family-grid">
            {families.map((f) => (
              <div key={f.id} className="network-family-card">
                <div className="network-family-name">{f.name}</div>
                <div className="network-family-founder">Thủy tổ: {f.founderName || 'Chưa cập nhật'}</div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 12px', lineHeight: 1.5 }}>
                  {f.history || 'Chưa có lịch sử dòng họ.'}
                </p>
                <div className="network-family-meta">
                  <span className="network-meta-chip green">{f.memberCount} thành viên</span>
                  <span className="network-meta-chip">📍 {f.originPlace || 'Chưa rõ quê quán'}</span>
                  {f.branches.map((b, i) => (
                    <span key={i} className="network-meta-chip purple">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="network-empty">Chưa có dữ liệu dòng họ Nội nào trong cơ sở dữ liệu.</div>
        )}
      </div>
    </div>
  );
};

export default FamilyPaternalTab;
