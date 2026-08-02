import React, { useEffect, useState } from 'react';
import { fetchInLawMarriages } from '../../../services/network.service';
import type { InLawMarriage } from '../../../types/network';
import '../Network.css';
import './InLawMarriagesTab.css';

export const InLawMarriagesTab: React.FC = () => {
  const [marriages, setMarriages] = useState<InLawMarriage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInLawMarriages().then((data) => {
      setMarriages(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu Dâu & Rể liên họ...</div>;

  return (
    <div className="network-layout">
      <div className="network-card">
        <h3 className="network-card-title">Dâu & Rể Liên Họ</h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 20px' }}>
          Danh sách các cuộc hôn nhân kết nối giữa hai dòng họ khác nhau, tạo nên mạng lưới thông gia.
        </p>
        {marriages.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {marriages.map((m) => (
              <div key={m.id} className="network-marriage-row">
                <div className="network-marriage-person">
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>🤵</div>
                  <div className="network-marriage-name">{m.husbandName}</div>
                  <div className="network-marriage-family">{m.husbandFamily}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div className="network-marriage-heart">💍</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {m.marriageDate || 'Chưa rõ ngày'}
                  </div>
                  {m.notes && (
                    <div style={{ fontSize: '11.5px', color: '#64748b', textAlign: 'center', marginTop: '4px', maxWidth: '250px' }}>
                      {m.notes}
                    </div>
                  )}
                </div>

                <div className="network-marriage-person">
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>👰</div>
                  <div className="network-marriage-name">{m.wifeName}</div>
                  <div className="network-marriage-family">{m.wifeFamily}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="network-empty">Chưa có dữ liệu hôn nhân liên họ nào.</div>
        )}
      </div>
    </div>
  );
};

export default InLawMarriagesTab;
