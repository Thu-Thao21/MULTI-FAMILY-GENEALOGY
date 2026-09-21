import React, { useEffect, useMemo, useState } from 'react';
import { proposalMockData, type ProposalRecord, type ProposalStatus } from '../../../data/sprint5MockData';
import { AdminConfirmDialog, AdminModal, AdminPageHeader, AdminPagination, AdminStatePanel, AdminStatusBadge, AdminToast, useAdminToast } from '../Sprint6Admin/shared';
import '../Sprint6Admin/Sprint6Admin.css';

const PAGE_SIZE = 4;
const statusLabels: Record<ProposalStatus, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Đã từ chối' };

export const AdminApprovalsMgmt: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalRecord[]>(() => proposalMockData.map((item) => ({ ...item })));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ProposalStatus>('pending');
  const [type, setType] = useState<'all' | ProposalRecord['type']>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ProposalRecord | null>(null);
  const [approveTarget, setApproveTarget] = useState<ProposalRecord | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ProposalRecord | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [formError, setFormError] = useState('');
  const { toast, showToast, dismissToast } = useAdminToast();

  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 320); return () => window.clearTimeout(timer); }, []);
  useEffect(() => setPage(1), [search, status, type]);

  const filtered = useMemo(() => proposals.filter((item) => {
    const text = `${item.id} ${item.proposerName} ${item.targetName} ${item.relationship} ${item.proposedValue}`.toLocaleLowerCase('vi');
    return text.includes(search.trim().toLocaleLowerCase('vi')) && (status === 'all' || item.status === status) && (type === 'all' || item.type === type);
  }), [proposals, search, status, type]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updateStatus = (target: ProposalRecord, nextStatus: ProposalStatus, note?: string) => {
    const updated: ProposalRecord = { ...target, status: nextStatus, adminNote: note || (nextStatus === 'approved' ? 'Đã xác minh và chấp thuận bởi Quản trị viên.' : target.adminNote) };
    setProposals((current) => current.map((item) => item.id === target.id ? updated : item));
    if (selected?.id === target.id) setSelected(updated);
    setApproveTarget(null); setRejectTarget(null); setRejectNote(''); setFormError('');
    showToast(nextStatus === 'approved' ? `Đã phê duyệt ${target.id}.` : `Đã từ chối ${target.id}.`);
  };

  const submitReject = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rejectTarget) return;
    if (rejectNote.trim().length < 10) { setFormError('Lý do từ chối cần có tối thiểu 10 ký tự.'); return; }
    updateStatus(rejectTarget, 'rejected', rejectNote.trim());
  };

  const clearFilters = () => { setSearch(''); setStatus('all'); setType('all'); };

  return <section className="s6a-page">
    <AdminPageHeader eyebrow="PHÊ DUYỆT DỮ LIỆU" title="Trung tâm đề xuất gia phả" description="Đối chiếu thay đổi hồ sơ và quan hệ, phê duyệt hoặc phản hồi rõ lý do cho người gửi." actions={<button type="button" className="s6a-button secondary" onClick={() => setStatus('pending')}>{proposals.filter((item) => item.status === 'pending').length} yêu cầu chờ</button>} />
    <div className="s6a-metric-grid"><article className="s6a-metric-card"><span>Tổng đề xuất</span><strong>{proposals.length}</strong><small>Trong dữ liệu demo</small></article><article className="s6a-metric-card"><span>Chờ xử lý</span><strong>{proposals.filter((item) => item.status === 'pending').length}</strong><small>Cần người có quyền duyệt</small></article><article className="s6a-metric-card"><span>Đã chấp thuận</span><strong>{proposals.filter((item) => item.status === 'approved').length}</strong><small>Dữ liệu đã xác nhận</small></article><article className="s6a-metric-card"><span>Đã từ chối</span><strong>{proposals.filter((item) => item.status === 'rejected').length}</strong><small>Có phản hồi lý do</small></article></div>
    <div className="s6a-card">
      <div className="s6a-card-heading"><div><h2>Danh sách đề xuất</h2><p>Tìm kiếm, lọc và mở hồ sơ để ra quyết định.</p></div><span className="s6a-count-pill">{filtered.length} kết quả</span></div>
      <div className="s6a-filter-bar s6a-filter-grid"><label className="s6a-search-field wide"><span>Tìm kiếm</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mã, người gửi, thành viên, nội dung..." /></label><label><span>Loại đề xuất</span><select value={type} onChange={(event) => setType(event.target.value as typeof type)}><option value="all">Tất cả</option><option value="profile">Hồ sơ cá nhân</option><option value="relationship">Quan hệ gia đình</option></select></label><label><span>Trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Tất cả</option><option value="pending">Chờ duyệt</option><option value="approved">Đã duyệt</option><option value="rejected">Đã từ chối</option></select></label><button type="button" className="s6a-button ghost align-end" onClick={clearFilters} disabled={!search && status === 'all' && type === 'all'}>Đặt lại</button></div>
      {loading ? <AdminStatePanel kind="loading" message="Đang chuẩn bị danh sách đề xuất..." /> : !visible.length ? <AdminStatePanel kind="empty" title="Không có đề xuất phù hợp" message="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." action={<button type="button" className="s6a-button secondary" onClick={clearFilters}>Xóa bộ lọc</button>} /> : <><div className="s6a-table-wrap"><table className="s6a-table"><thead><tr><th>Mã / Người gửi</th><th>Thành viên</th><th>Loại & quan hệ</th><th>Thay đổi đề xuất</th><th>Ngày gửi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><button type="button" className="s6a-table-id" onClick={() => setSelected(item)}>{item.id}</button><span className="s6a-table-subline">{item.proposerName}</span></td><td><strong>{item.targetName}</strong></td><td><span className="s6a-table-main">{item.type === 'profile' ? 'Hồ sơ' : 'Quan hệ'}</span><span className="s6a-table-subline">{item.relationship}</span></td><td><span className="s6a-table-subline">{item.currentValue}</span><strong>→ {item.proposedValue}</strong></td><td>{item.createdAt}</td><td><AdminStatusBadge status={item.status} label={statusLabels[item.status]} /></td><td><div className="s6a-inline-actions"><button type="button" className="s6a-link-button" onClick={() => setSelected(item)}>Chi tiết</button>{item.status === 'pending' && <><button type="button" className="s6a-link-button success-text" onClick={() => setApproveTarget(item)}>Duyệt</button><button type="button" className="s6a-link-button danger-text" onClick={() => { setRejectTarget(item); setRejectNote(''); setFormError(''); }}>Từ chối</button></>}</div></td></tr>)}</tbody></table></div><AdminPagination page={safePage} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} /></>}
    </div>
    <AdminModal open={Boolean(selected)} title={selected ? `Đề xuất ${selected.id}` : ''} description="Đối chiếu dữ liệu hiện tại, nội dung đề xuất và minh chứng." onClose={() => setSelected(null)} size="lg" footer={selected && <><button type="button" className="s6a-button secondary" onClick={() => setSelected(null)}>Đóng</button>{selected.status === 'pending' && <><button type="button" className="s6a-button danger" onClick={() => { setRejectTarget(selected); setRejectNote(''); }}>Từ chối</button><button type="button" className="s6a-button primary" onClick={() => setApproveTarget(selected)}>Phê duyệt</button></>}</>}>
      {selected && <div className="s6a-detail-grid"><div><span>Người gửi</span><strong>{selected.proposerName}</strong></div><div><span>Thành viên liên quan</span><strong>{selected.targetName}</strong></div><div><span>Loại</span><strong>{selected.type === 'profile' ? 'Cập nhật hồ sơ' : 'Quan hệ gia đình'}</strong></div><div><span>Ngày gửi</span><strong>{selected.createdAt}</strong></div><div><span>Dữ liệu hiện tại</span><strong>{selected.currentValue}</strong></div><div><span>Dữ liệu đề xuất</span><strong>{selected.proposedValue}</strong></div><div className="wide"><span>Nội dung / Quan hệ</span><strong>{selected.relationship}</strong></div><div className="wide"><span>Lý do & minh chứng</span><p>{selected.reason}</p></div>{selected.adminNote && <div className="wide"><span>Phản hồi người duyệt</span><p>{selected.adminNote}</p></div>}</div>}
    </AdminModal>
    <AdminConfirmDialog open={Boolean(approveTarget)} title="Phê duyệt đề xuất?" message={approveTarget ? `${approveTarget.id} sẽ được đánh dấu đã duyệt và sẵn sàng cập nhật dữ liệu.` : ''} confirmLabel="Xác nhận phê duyệt" onCancel={() => setApproveTarget(null)} onConfirm={() => approveTarget && updateStatus(approveTarget, 'approved')} />
    <AdminModal open={Boolean(rejectTarget)} title="Từ chối đề xuất" description="Phản hồi sẽ hiển thị cho người gửi." onClose={() => setRejectTarget(null)} size="sm" footer={<><button type="button" className="s6a-button secondary" onClick={() => setRejectTarget(null)}>Hủy</button><button type="submit" form="reject-proposal-form" className="s6a-button danger">Xác nhận từ chối</button></>}><form id="reject-proposal-form" className="s6a-form s6a-form-grid one-column" onSubmit={submitReject}><label className="full"><span>Lý do từ chối *</span><textarea value={rejectNote} onChange={(event) => setRejectNote(event.target.value)} placeholder="Nêu dữ liệu còn thiếu hoặc lý do chưa thể xác minh..." rows={4} />{formError && <small className="s6a-form-error">{formError}</small>}</label></form></AdminModal>
    <AdminToast toast={toast} onDismiss={dismissToast} />
  </section>;
};

export default AdminApprovalsMgmt;
