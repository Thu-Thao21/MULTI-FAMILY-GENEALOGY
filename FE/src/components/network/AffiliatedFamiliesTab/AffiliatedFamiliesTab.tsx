import React, { useEffect, useState } from 'react';
import { fetchFamilyNetwork } from '../../../services/network.service';
import type { FamilyNetwork } from '../../../types/network';
import '../Network.css';

export const AffiliatedFamiliesTab: React.FC = () => {
  const [families, setFamilies] = useState<FamilyNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyNetwork('thong-gia').then((data) => {
      setFamilies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="network-loading-prompt">Đang tải dữ liệu Họ Thông gia...</div>;

  return (
    <div className="network-layout">
      <div className="network-card">
        <h3 className="network-card-title">Họ Thông Gia</h3>
        <p className="network-card-subtitle">
          Các dòng họ liên kết gián tiếp qua quan hệ hôn nhân giữa con cháu nhiều thế hệ.
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
                  <span className="network-meta-chip amber">{f.memberCount} thành viên</span>
                  <span className="network-meta-chip">📍 {f.originPlace || 'Chưa rõ quê quán'}</span>
                  <span className="network-meta-chip purple">Thông gia</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="network-empty">Chưa có dữ liệu dòng họ Thông gia nào trong cơ sở dữ liệu.</div>
        )}
      </div>
    </div>
  );
};

export default AffiliatedFamiliesTab;
