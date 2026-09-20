import React, { useState } from 'react';
import './ClanFundsModule.css';

export interface FundItem {
  id: string;
  name: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  description: string;
}

export interface ContributionRecord {
  id: string;
  fundId: string;
  fundName: string;
  amount: number;
  date: string;
  purpose: string;
  receiptCode: string;
  status: 'confirmed' | 'pending';
}

export const ClanFundsModule: React.FC = () => {
  const [funds] = useState<FundItem[]>([
    {
      id: 'fund-01',
      name: 'Quỹ Khuyến Học Gia Tộc',
      totalIncome: 125000000,
      totalExpense: 45000000,
      balance: 80000000,
      description: 'Dùng cho khen thưởng học sinh sinh viên giỏi và hỗ trợ con em đỗ đại học.',
    },
    {
      id: 'fund-02',
      name: 'Quỹ Tu Bổ Từ Đường & Mộ Tổ',
      totalIncome: 350000000,
      totalExpense: 210000000,
      balance: 140000000,
      description: 'Dùng cho sửa chữa nhà thờ tổ, xây dựng cổng làng và bảo tồn công trình dòng họ.',
    },
    {
      id: 'fund-03',
      name: 'Quỹ Việc Hiếu Nghĩa & Tương Trợ',
      totalIncome: 90000000,
      totalExpense: 35000000,
      balance: 55000000,
      description: 'Dùng cho trợ cấp rủi ro, ốm đau, hiếu hỷ của thành viên dòng họ.',
    },
  ]);

  const [myContributions] = useState<ContributionRecord[]>([
    {
      id: 'contrib-001',
      fundId: 'fund-01',
      fundName: 'Quỹ Khuyến Học Gia Tộc',
      amount: 2000000,
      date: '10/01/2026',
      purpose: 'Đóng góp xuân 2026',
      receiptCode: 'REC-2026-0012',
      status: 'confirmed',
    },
    {
      id: 'contrib-002',
      fundId: 'fund-02',
      fundName: 'Quỹ Tu Bổ Từ Đường & Mộ Tổ',
      amount: 5000000,
      date: '15/02/2026',
      purpose: 'Ủng hộ sơn sửa nhà thờ tổ',
      receiptCode: 'REC-2026-0089',
      status: 'confirmed',
    },
    {
      id: 'contrib-003',
      fundId: 'fund-01',
      fundName: 'Quỹ Khuyến Học Gia Tộc',
      amount: 1000000,
      date: '01/09/2026',
      purpose: 'Ủng hộ đợt khen thưởng thu 2026',
      receiptCode: 'REC-2026-0245',
      status: 'pending',
    },
  ]);

  const [activeFundFilter, setActiveFundFilter] = useState<string>('all');

  const filteredContributions = myContributions.filter((c) => {
    if (activeFundFilter === 'all') return true;
    return c.fundId === activeFundFilter;
  });

  const totalMyAmount = myContributions
    .filter((c) => c.status === 'confirmed')
    .reduce((sum, c) => sum + c.amount, 0);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="funds-container">
      <div className="funds-header">
        <h2 className="funds-title">Quỹ Dòng Họ & Lịch Sử Đóng Góp</h2>
        <p className="funds-subtitle">
          Minh bạch thu chi tài chính gia tộc và quản lý lịch sử đóng góp cá nhân.
        </p>
      </div>

      {/* Fund Summaries */}
      <div className="funds-overview-grid">
        {funds.map((f) => (
          <div key={f.id} className="fund-summary-card">
            <h3 className="fund-card-title">{f.name}</h3>
            <p className="fund-desc">{f.description}</p>
            <div className="fund-balance-row">
              <span className="balance-label">Số dư quỹ hiện tại:</span>
              <span className="balance-val">{formatVND(f.balance)}</span>
            </div>
            <div className="fund-stat-sub">
              <span>Thu: {formatVND(f.totalIncome)}</span>
              <span>Chi: {formatVND(f.totalExpense)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My Contributions */}
      <div className="my-contrib-section">
        <div className="my-contrib-header">
          <div>
            <h3 className="my-contrib-title">Lịch Sử Đóng Góp Cá Nhân</h3>
            <span className="my-total-badge">
              Tổng số tiền đã đóng góp (Đã xác nhận): <strong>{formatVND(totalMyAmount)}</strong>
            </span>
          </div>

          {/* Filter Dropdown */}
          <select
            className="fund-filter-select"
            value={activeFundFilter}
            onChange={(e) => setActiveFundFilter(e.target.value)}
          >
            <option value="all">-- Tất cả các quỹ --</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="contrib-table-wrapper">
          <table className="contrib-table">
            <thead>
              <tr>
                <th>Mã chứng từ</th>
                <th>Tên quỹ</th>
                <th>Nội dung đóng góp</th>
                <th>Ngày đóng</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                    Chưa có lịch sử đóng góp nào cho quỹ này.
                  </td>
                </tr>
              ) : (
                filteredContributions.map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.receiptCode}</code></td>
                    <td style={{ fontWeight: 600 }}>{c.fundName}</td>
                    <td>{c.purpose}</td>
                    <td>{c.date}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{formatVND(c.amount)}</td>
                    <td>
                      <span className={`contrib-status-pill ${c.status}`}>
                        {c.status === 'confirmed' ? '✓ Đã xác nhận' : '⏳ Đang chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClanFundsModule;
