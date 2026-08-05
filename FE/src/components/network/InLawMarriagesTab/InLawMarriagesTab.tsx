import React, { useEffect, useState } from 'react';
import { fetchInLawMarriages } from '../../../services/network.service';
import type { InLawMarriage } from '../../../types/network';
import '../Network.css';

export const InLawMarriagesTab: React.FC = () => {
  const [marriages, setMarriages] = useState<InLawMarriage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInLawMarriages().then((data) => {
      setMarriages(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="network-loading-prompt">Đang tải dữ liệu Dâu & Rể liên họ...</div>;

  return (
    <div className="network-layout">
      <div className="network-card">
        <h3 className="network-card-title">Dâu & Rể Liên Họ</h3>
        <p className="network-card-subtitle">
          Danh sách các cuộc hôn nhân kết nối giữa hai dòng họ khác nhau, tạo nên mạng lưới thông gia.
        </p>
        {marriages.length > 0 ? (
          <div className="network-marriage-list">
            {marriages.map((m) => (
              <div key={m.id} className="network-marriage-row">
                <div className="network-marriage-person">
                  <div className="network-marriage-avatar-icon"></div>
                  <div className="network-marriage-name">{m.husbandName}</div>
                  <div className="network-marriage-family">{m.husbandFamily}</div>
                </div>

                <div className="network-marriage-center-col">
                  <div className="network-marriage-heart"></div>
                  <div className="network-marriage-date">
                    {m.marriageDate || 'Chưa rõ ngày'}
                  </div>
                  {m.notes && <div className="network-marriage-notes">{m.notes}</div>}
                </div>

                <div className="network-marriage-person">
                  <div className="network-marriage-avatar-icon"></div>
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
