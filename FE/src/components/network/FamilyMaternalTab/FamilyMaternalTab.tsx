import React, { useEffect, useState } from 'react';
import { fetchFamilyNetwork } from '../../../services/network.service';
import type { FamilyNetwork } from '../../../types/network';
import '../Network.css';

export const FamilyMaternalTab: React.FC = () => {
  const [families, setFamilies] = useState<FamilyNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyNetwork('ngoai').then((data) => {
      setFamilies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="network-loading-prompt">Đang tải dữ liệu Dòng họ Ngoại...</div>;

  return (
    <div className="network-layout">
      <div className="network-card">
        <h3 className="network-card-title">Dòng Họ Ngoại (Bên Mẹ)</h3>
        <p className="network-card-subtitle">
          Các dòng họ thuộc bên ngoại mẹ, gắn kết qua quan hệ hôn nhân với dòng họ Nội.
        </p>
        {families.length > 0 ? (
          <div className="network-family-grid">
            {families.map((f) => (
              <div key={f.id} className="network-family-card">
                <div className="network-family-name">{f.name}</div>
                <div className="network-family-founder">Thủy tổ: {f.founderName || 'Chưa cập nhật'}</div>
                <p className="network-family-history-text">
                  {f.history || 'Chưa có lịch sử dòng họ.'}
                </p>
                <div className="network-family-meta">
                  <span className="network-meta-chip purple">{f.memberCount} thành viên</span>
                  <span className="network-meta-chip">📍 {f.originPlace || 'Chưa rõ quê quán'}</span>
                  {f.branches.map((b, i) => (
                    <span key={i} className="network-meta-chip amber">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="network-empty">Chưa có dữ liệu dòng họ Ngoại nào trong cơ sở dữ liệu.</div>
        )}
      </div>
    </div>
  );
};

export default FamilyMaternalTab;
