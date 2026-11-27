import React from 'react';
import { EmptyState } from '../../../shared/Feedback/EmptyState';
import type { FamilyAdminState } from '../familyAdminStore';

interface FamilyOverviewViewProps {
  data: FamilyAdminState;
  totalPersons: number;
  maleCount: number;
  femaleCount: number;
  livingCount: number;
  deceasedCount: number;
  generationDistribution: {
    list: Array<{ gen: number; count: number }>;
    maxCount: number;
    maxGen: number;
  };
  onNavigate: (view: 'members' | 'relations' | 'branches' | 'approvals' | 'exchange') => void;
}

export const FamilyOverviewView: React.FC<FamilyOverviewViewProps> = ({
  data,
  totalPersons,
  maleCount,
  femaleCount,
  livingCount,
  deceasedCount,
  generationDistribution,
  onNavigate,
}) => {
  return (
    <>
      <div className="fa-stat-grid">
        <div className="fa-stat-card">
          <span>Tổng số nhân khẩu</span>
          <strong>{totalPersons}</strong>
          <small>{data.branches.length} Chi/Nhánh đã ghi nhận</small>
        </div>
        <div className="fa-stat-card">
          <span>Nam giới</span>
          <strong style={{ color: '#2563eb' }}>{maleCount}</strong>
          <small>{totalPersons ? Math.round((maleCount / totalPersons) * 100) : 0}% tổng dòng họ</small>
        </div>
        <div className="fa-stat-card">
          <span>Nữ giới</span>
          <strong style={{ color: '#db2777' }}>{femaleCount}</strong>
          <small>{totalPersons ? Math.round((femaleCount / totalPersons) * 100) : 0}% tổng dòng họ</small>
        </div>
        <div className="fa-stat-card">
          <span>Còn sống / Hiện diện</span>
          <strong style={{ color: '#059669' }}>{livingCount}</strong>
          <small>{deceasedCount} tiền nhân đã khuất</small>
        </div>
        <div className="fa-stat-card">
          <span>Thế hệ ghi nhận</span>
          <strong style={{ color: '#d97706' }}>{generationDistribution.maxGen} Đời</strong>
          <small>Từ Thủy tổ đến thế hệ con cháu</small>
        </div>
        <div className="fa-stat-card">
          <span>Quan hệ phả hệ</span>
          <strong style={{ color: '#7c3aed' }}>{data.relations.length}</strong>
          <small>Liên kết cha mẹ - con & hôn phối</small>
        </div>
      </div>

      <div className="fa-panel">
        <div className="fa-panel-heading">
          <div>
            <h2>Phân bố thành viên theo thế hệ (Đời thứ)</h2>
            <p>Thống kê số lượng con cháu qua từng thế hệ của dòng tộc trong cơ sở dữ liệu.</p>
          </div>
        </div>
        {generationDistribution.list.length > 0 ? (
          <div className="fa-gen-bars">
            {generationDistribution.list.map(({ gen, count }) => {
              const pct = Math.round((count / totalPersons) * 100) || 0;
              const barWidth = Math.round((count / generationDistribution.maxCount) * 100);
              return (
                <div key={gen} className="fa-gen-bar-row">
                  <span className="fa-gen-bar-label">Đời {gen}</span>
                  <div className="fa-gen-bar-track">
                    <div className="fa-gen-bar-fill" style={{ width: `${Math.max(barWidth, 4)}%` }} />
                  </div>
                  <span className="fa-gen-bar-value">{count} người ({pct}%)</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            variant="chart"
            compact
            title="Chưa đủ dữ liệu thành viên để phân tích thế hệ"
            subMessage="Hệ thống cần ít nhất thông tin các đời để tính toán tỉ lệ phân bố phái hệ."
          />
        )}
      </div>

      <div className="fa-panel">
        <div className="fa-panel-heading">
          <div>
            <h2>Cơ cấu nhân khẩu theo Chi & Nhánh</h2>
            <p>Số lượng thành viên thuộc từng chi phái trực hệ.</p>
          </div>
        </div>
        <div className="fa-card-grid">
          {data.branches.map((b) => {
            const count = data.persons.filter((p) => p.branchId === b.id).length;
            const pct = totalPersons ? Math.round((count / totalPersons) * 100) : 0;
            return (
              <div key={b.id} className="fa-card">
                <span className="fa-card-eyebrow">CHI NHÁNH</span>
                <h3>{b.name}</h3>
                <p>{b.description || 'Chưa cập nhật mô tả chi nhánh.'}</p>
                <dl>
                  <div>
                    <dt>Số thành viên</dt>
                    <dd>{count} người ({pct}%)</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fa-panel">
        <h2>Lối tắt quản lý dòng họ</h2>
        <div className="fa-actions" style={{ gap: '10px' }}>
          <button type="button" className="fa-primary" onClick={() => onNavigate('members')}>Quản lý thành viên →</button>
          <button type="button" onClick={() => onNavigate('relations')}>Thiết lập quan hệ →</button>
          <button type="button" onClick={() => onNavigate('branches')}>Quản lý Chi/Nhánh →</button>
          <button type="button" onClick={() => onNavigate('approvals')}>Phê duyệt hồ sơ →</button>
          <button type="button" onClick={() => onNavigate('exchange')}>Nhập/Xuất Excel →</button>
        </div>
      </div>
    </>
  );
};
