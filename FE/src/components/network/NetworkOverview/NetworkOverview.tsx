import React, { useEffect, useState } from 'react';
import { fetchFamilyNetwork } from '../../../services/network.service';
import type { FamilyNetwork } from '../../../types/network';
import '../Network.css';
import './NetworkOverview.css';

export interface NetworkOverviewProps {
  onSelectTab?: (tab: string) => void;
}

export const NetworkOverview: React.FC<NetworkOverviewProps> = ({ onSelectTab }) => {
  const [allFamilies, setAllFamilies] = useState<FamilyNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilyNetwork('all').then((data) => {
      setAllFamilies(data);
      setLoading(false);
    });
  }, []);

  const noiFamilies = allFamilies.filter((f) => f.category === 'noi');
  const ngoaiFamilies = allFamilies.filter((f) => f.category === 'ngoai');
  const thongGiaFamilies = allFamilies.filter((f) => f.category === 'thong-gia');
  const totalMembers = allFamilies.reduce((sum, f) => sum + f.memberCount, 0);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Đang tải mạng lưới liên họ...</div>;
  }

  return (
    <div className="network-layout">
      <div className="network-overview-banner">
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Mạng Lưới Liên Họ
        </h1>
        <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: '14px' }}>
          Quản lý kết nối giữa các dòng họ Nội, Ngoại, Dâu Rể và Thông gia trong hệ thống gia phả đa dòng họ.
        </p>

        <div className="network-stats-row">
          <div className="network-stat-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab?.('net-noi')}>
            <div className="network-stat-number">{noiFamilies.length}</div>
            <div className="network-stat-label">Dòng họ Nội</div>
          </div>
          <div className="network-stat-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab?.('net-ngoai')}>
            <div className="network-stat-number">{ngoaiFamilies.length}</div>
            <div className="network-stat-label">Dòng họ Ngoại</div>
          </div>
          <div className="network-stat-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab?.('net-dau-re')}>
            <div className="network-stat-number">4</div>
            <div className="network-stat-label">Dâu & Rể liên họ</div>
          </div>
          <div className="network-stat-card" style={{ cursor: 'pointer' }} onClick={() => onSelectTab?.('net-thong-gia')}>
            <div className="network-stat-number">{thongGiaFamilies.length}</div>
            <div className="network-stat-label">Họ Thông gia</div>
          </div>
          <div className="network-stat-card">
            <div className="network-stat-number">{totalMembers}</div>
            <div className="network-stat-label">Tổng thành viên</div>
          </div>
        </div>
      </div>

      <div className="network-card">
        <h3 className="network-card-title">Tất Cả Dòng Họ Trong Mạng Lưới</h3>
        <div className="network-family-grid">
          {allFamilies.map((f) => (
            <div key={f.id} className="network-family-card">
              <div className="network-family-name">{f.name}</div>
              <div className="network-family-founder">Khai tổ: {f.founderName || 'Chưa rõ'} • {f.originPlace || ''}</div>
              <div className="network-family-meta">
                <span className="network-meta-chip">{f.memberCount} thành viên</span>
                <span className={`network-meta-chip ${f.category === 'noi' ? 'green' : f.category === 'ngoai' ? 'purple' : 'amber'}`}>
                  {f.category === 'noi' ? 'Họ Nội' : f.category === 'ngoai' ? 'Họ Ngoại' : 'Thông gia'}
                </span>
                {f.branches.length > 0 && <span className="network-meta-chip">{f.branches.length} chi</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkOverview;
