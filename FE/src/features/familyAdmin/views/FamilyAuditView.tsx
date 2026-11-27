import React from 'react';
import { EmptyState } from '../../../shared/Feedback/EmptyState';
import { LoadingState } from '../../../shared/Feedback/LoadingState';
import type { ClanAuditLogItem } from '../../../services/genealogy.service';
import { formatAuditActionLabel } from '../utils/familyAdminHelpers';

interface FamilyAuditViewProps {
  clanAuditLogs: ClanAuditLogItem[];
  loadingAuditLogs: boolean;
  auditCategoryFilter: string;
  setAuditCategoryFilter: (cat: string) => void;
  auditSearchTerm: string;
  setAuditSearchTerm: (term: string) => void;
  onRefresh: () => void;
}

const AUDIT_CATEGORIES = [
  { key: 'MEMBER', label: 'Thành viên' },
  { key: 'RELATION', label: 'Quan hệ' },
  { key: 'APPROVAL', label: 'Xét duyệt' },
  { key: 'PERMISSION', label: 'Phân quyền' },
  { key: 'LINK', label: 'Liên họ' },
];

export const FamilyAuditView: React.FC<FamilyAuditViewProps> = ({
  clanAuditLogs,
  loadingAuditLogs,
  auditCategoryFilter,
  setAuditCategoryFilter,
  auditSearchTerm,
  setAuditSearchTerm,
  onRefresh,
}) => {
  const filteredLogs = clanAuditLogs.filter((l) => {
    const matchCat = auditCategoryFilter === 'all' || l.actionType === auditCategoryFilter;
    const matchSearch =
      !auditSearchTerm.trim() ||
      [l.action, formatAuditActionLabel(l.action), l.details, l.actorName]
        .join(' ')
        .toLowerCase()
        .includes(auditSearchTerm.trim().toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="fa-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="fa-stat-card">
          <span>Tổng số hoạt động</span>
          <strong style={{ color: '#2563eb' }}>{clanAuditLogs.length}</strong>
          <small>Ghi nhận từ cơ sở dữ liệu hệ thống</small>
        </div>
        <div className="fa-stat-card">
          <span>Thao tác phả hệ</span>
          <strong style={{ color: '#7c3aed' }}>
            {clanAuditLogs.filter((l) => ['MEMBER', 'RELATION', 'BRANCH'].includes(l.actionType)).length}
          </strong>
          <small>Thêm/Sửa thành viên, quan hệ, chi nhánh</small>
        </div>
        <div className="fa-stat-card">
          <span>Xét duyệt & Quyền hạn</span>
          <strong style={{ color: '#059669' }}>
            {clanAuditLogs.filter((l) => ['APPROVAL', 'PERMISSION', 'LINK'].includes(l.actionType)).length}
          </strong>
          <small>Duyệt hồ sơ, phân quyền, liên họ</small>
        </div>
      </div>

      <div className="fa-panel">
        <div className="fa-panel-heading">
          <div>
            <h2>Lịch sử hoạt động & Nhật ký kiểm toán</h2>
            <p>Theo dõi minh bạch mọi thay đổi dữ liệu trong dòng họ theo thời gian thực.</p>
          </div>
          <button type="button" onClick={onRefresh} disabled={loadingAuditLogs}>
            {loadingAuditLogs ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        <div className="fa-filter-pills">
          <button
            type="button"
            className={`fa-filter-pill ${auditCategoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setAuditCategoryFilter('all')}
          >
            Tất cả ({clanAuditLogs.length})
          </button>
          {AUDIT_CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`fa-filter-pill ${auditCategoryFilter === c.key ? 'active' : ''}`}
              onClick={() => setAuditCategoryFilter(c.key)}
            >
              {c.label} ({clanAuditLogs.filter((l) => l.actionType === c.key).length})
            </button>
          ))}
        </div>

        <div className="fa-toolbar" style={{ marginBottom: '24px' }}>
          <input
            type="search"
            value={auditSearchTerm}
            onChange={(e) => setAuditSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung thao tác, tên người thực hiện, thành viên..."
            aria-label="Tìm kiếm nhật ký"
          />
          <span>Hiển thị {filteredLogs.length} hoạt động</span>
        </div>

        <div className="fa-timeline">
          {filteredLogs.length === 0 ? (
            loadingAuditLogs ? (
              <LoadingState
                message="Đang truy xuất nhật ký phả hệ dòng tộc..."
                subMessage="Hệ thống đang tải lịch sử các thao tác quản trị từ cơ sở dữ liệu."
              />
            ) : (
              <EmptyState
                variant="history"
                title="Không tìm thấy nhật ký hoạt động phù hợp"
                subMessage="Hãy thử thay đổi danh mục hoạt động hoặc xóa từ khóa tìm kiếm để xem tất cả lịch sử."
              />
            )
          ) : (
            filteredLogs.map((log) => {
              const typeKey = (log.actionType || 'member').toLowerCase();
              const formattedDate = new Date(log.occurredAt).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              const dotColor =
                log.actionType === 'RELATION'
                  ? '#7c3aed'
                  : log.actionType === 'APPROVAL'
                  ? '#059669'
                  : log.actionType === 'PERMISSION'
                  ? '#d97706'
                  : log.actionType === 'BRANCH'
                  ? '#ea580c'
                  : log.actionType === 'LINK'
                  ? '#0284c7'
                  : log.actionType === 'EXPORT'
                  ? '#64748b'
                  : '#2563eb';
              const badgeLabel =
                log.actionType === 'MEMBER'
                  ? 'Thành viên'
                  : log.actionType === 'RELATION'
                  ? 'Quan hệ'
                  : log.actionType === 'BRANCH'
                  ? 'Chi/Nhánh'
                  : log.actionType === 'APPROVAL'
                  ? 'Xét duyệt'
                  : log.actionType === 'PERMISSION'
                  ? 'Phân quyền'
                  : log.actionType === 'LINK'
                  ? 'Liên họ'
                  : 'Xuất dữ liệu';
              return (
                <div key={log.id} className="fa-timeline-item">
                  <div className="fa-timeline-node" style={{ background: dotColor }} />
                  <div className="fa-audit-card">
                    <div className="fa-audit-header">
                      <span className={`fa-audit-type-badge ${typeKey}`}>{badgeLabel}</span>
                      <span className="fa-timeline-time">{formattedDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                        {formatAuditActionLabel(log.action)}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
                      <span className="fa-audit-actor">{log.actorName}</span>
                    </div>
                    <div className="fa-audit-details">{log.details}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
