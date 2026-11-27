import { useAuth } from '../../../context/AuthContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FeatureEmptyState, FeatureIcon, FeatureModal, FeaturePagination, FeatureToast } from '../../common/FeatureUI';
import { proposalMockData, type ProposalRecord, type ProposalStatus } from '../../../types/clanActivity.types';
import { getMyJoinRequests, type ClanJoinRequestItem } from '../../../services/clanJoin.service';
import { getCached, setCached } from '../../../utils/memoryCache';
import './MyProposalsModule.css';

type ProposalForm = {
  targetName: string;
  type: 'profile' | 'relationship';
  relationship: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
};

const EMPTY_FORM: ProposalForm = { targetName: '', type: 'relationship', relationship: '', currentValue: '', proposedValue: '', reason: '' };
const PAGE_SIZE = 4;
const statusLabel: Record<ProposalStatus, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };

const mapJoinRequestToProposal = (req: ClanJoinRequestItem): ProposalRecord => {
  const statusMap: Record<ClanJoinRequestItem['status'], ProposalStatus> = {
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'rejected',
    PENDING: 'pending',
    NEED_INFO: 'pending',
  };
  const lineageLabel = req.lineage_type === 'MATERNAL' ? 'Bên ngoại' : 'Bên nội';
  return {
    id: `JN-${req.request_id.slice(0, 6).toUpperCase()}`,
    proposerName: req.full_name || req.user_display_name || 'Thành viên',
    proposerInitial: (req.full_name || 'T').trim().split(' ').pop()?.[0]?.toUpperCase() || 'T',
    targetName: `${req.clan_name} (${lineageLabel})`,
    type: 'profile',
    relationship: `Xin gia nhập dòng họ • Người thân: ${req.relative_name}`,
    currentValue: 'Chưa liên kết gia tộc',
    proposedValue: req.linked_person_name ? `Liên kết hồ sơ: ${req.linked_person_name}` : 'Gia nhập dòng họ',
    reason: req.verification_notes || 'Đề nghị xác minh gia nhập dòng họ',
    adminNote: req.review_note || undefined,
    status: statusMap[req.status] || 'pending',
    createdAt: req.created_at ? new Date(req.created_at).toLocaleString('vi-VN', { hour12: false }) : '—',
  };
};

export const MyProposalsModule: React.FC = () => {
  const { account } = useAuth();
  const cacheKey = `my-proposals:${account?.id || 'anon'}`;
  const [proposals, setProposals] = useState<ProposalRecord[]>(() => {
    return getCached<ProposalRecord[]>(cacheKey)?.data || proposalMockData;
  });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ProposalStatus>('all');
  const [type, setType] = useState<'all' | ProposalForm['type']>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ProposalRecord | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<ProposalForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ProposalForm, string>>>({});
  const [toast, setToast] = useState('');

  const loadMyProposals = useCallback(async () => {
    try {
      const joinReqs = await getMyJoinRequests();
      const mapped = (Array.isArray(joinReqs) ? joinReqs : []).map(mapJoinRequestToProposal);
      setProposals((prev) => {
        const localCreated = prev.filter((p) => p.id.startsWith('DX-'));
        const merged = [...localCreated, ...mapped];
        setCached(cacheKey, merged, 60_000);
        return merged;
      });
    } catch (err) {
      console.error('Lỗi tải danh sách đề xuất / đơn gia nhập của tôi:', err);
    }
  }, [cacheKey]);

  useEffect(() => {
    void loadMyProposals();
  }, [loadMyProposals]);

  const approvedCount = useMemo(() => proposals.filter((item) => item.status === 'approved').length, [proposals]);
  const rejectedCount = useMemo(() => proposals.filter((item) => item.status === 'rejected').length, [proposals]);
  const pendingCount = useMemo(() => proposals.filter((item) => item.status === 'pending').length, [proposals]);
  const decidedCount = approvedCount + rejectedCount;
  const approvalRate = decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 0;

  const filtered = useMemo(() => proposals.filter((item) => {
    const haystack = `${item.id} ${item.proposerName} ${item.targetName} ${item.relationship} ${item.proposedValue}`.toLocaleLowerCase('vi');
    return haystack.includes(search.trim().toLocaleLowerCase('vi')) && (status === 'all' || item.status === status) && (type === 'all' || item.type === type);
  }), [proposals, search, status, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => setPage(1), [search, status, type]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowCreate(true);
  };

  const submitProposal = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof ProposalForm, string>> = {};
    if (!form.targetName) nextErrors.targetName = 'Vui lòng chọn thành viên.';
    if (!form.relationship.trim()) nextErrors.relationship = 'Vui lòng chọn nội dung đề xuất.';
    if (!form.proposedValue.trim()) nextErrors.proposedValue = 'Giá trị đề xuất là bắt buộc.';
    if (form.reason.trim().length < 10) nextErrors.reason = 'Lý do cần có tối thiểu 10 ký tự.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const record: ProposalRecord = {
      id: `DX-${String(Date.now()).slice(-6)}`,
      proposerName: account?.display_name || 'Thành viên', proposerInitial: (account?.display_name || 'Thành viên').split(' ').pop()?.[0]?.toUpperCase() || 'T', targetName: form.targetName, type: form.type,
      relationship: form.relationship, currentValue: form.currentValue.trim() || 'Chưa có dữ liệu', proposedValue: form.proposedValue.trim(),
      reason: form.reason.trim(), status: 'pending', createdAt: new Date().toLocaleString('vi-VN', { hour12: false }),
    };
    setProposals((current) => [record, ...current]);
    setShowCreate(false); setStatus('all'); setPage(1);
    setToast('Đã gửi đề xuất. Trưởng dòng họ sẽ xem xét trong trung tâm phê duyệt.');
  };

  return <section className="proposals-container" aria-labelledby="proposal-page-title">
    <header className="proposals-hero">
      <div><span>HỒ SƠ & QUAN HỆ</span><h1 id="proposal-page-title">Đề xuất cập nhật gia phả</h1><p>Gửi yêu cầu có minh chứng, theo dõi trạng thái và xem phản hồi của người duyệt.</p></div>
      <button type="button" className="proposal-primary" onClick={openCreate}><FeatureIcon name="plus" /> Tạo đề xuất</button>
    </header>
    <div className="proposal-summary-grid">
      <article><span>Tất cả đề xuất</span><strong>{proposals.length}</strong><small>Hồ sơ, gia nhập & quan hệ</small></article>
      <article><span>Đang chờ duyệt</span><strong>{pendingCount}</strong><small>Cần trưởng dòng họ xử lý</small></article>
      <article><span>Đã được duyệt</span><strong>{approvedCount}</strong><small>Dữ liệu đã được xác nhận</small></article>
      <article><span>Tỷ lệ chấp thuận</span><strong>{approvalRate}%</strong><small>{decidedCount > 0 ? `Trên ${decidedCount} đề xuất đã xử lý` : 'Chưa có đề xuất đã xử lý'}</small></article>
    </div>
    <div className="proposal-list-card">
      <div className="proposal-toolbar">
        <label className="proposal-search"><FeatureIcon name="search" /><input aria-label="Tìm kiếm đề xuất" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã, người gửi, thành viên..." /></label>
        <select aria-label="Lọc loại đề xuất" value={type} onChange={(event) => setType(event.target.value as typeof type)}><option value="all">Tất cả loại</option><option value="profile">Cập nhật hồ sơ</option><option value="relationship">Quan hệ gia đình</option></select>
        <select aria-label="Lọc trạng thái" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Tất cả trạng thái</option><option value="pending">Chờ duyệt</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option></select>
      </div>
      <div className="proposal-table-wrap">
        <table className="proposal-table">
          <thead><tr><th>Người đề xuất</th><th>Thành viên liên quan</th><th>Loại / Quan hệ</th><th>Ngày gửi</th><th>Trạng thái</th><th aria-label="Thao tác" /></tr></thead>
          <tbody>{visible.map((item) => <tr key={item.id}>
            <td data-label="Người đề xuất"><div className="proposal-person"><span>{item.proposerInitial}</span><div><strong>{item.proposerName}</strong><small>{item.id}</small></div></div></td>
            <td data-label="Thành viên"><strong>{item.targetName}</strong><small className="proposal-mobile-sub">{item.currentValue} → {item.proposedValue}</small></td>
            <td data-label="Loại"><span className="proposal-type">{item.type === 'profile' ? 'Hồ sơ' : 'Quan hệ'}</span><small>{item.relationship}</small></td>
            <td data-label="Ngày gửi">{item.createdAt}</td>
            <td data-label="Trạng thái"><span className={`proposal-status ${item.status}`}>{statusLabel[item.status]}</span></td>
            <td><button type="button" className="proposal-icon-btn" onClick={() => setSelected(item)} aria-label={`Xem chi tiết ${item.id}`} title="Xem chi tiết"><FeatureIcon name="eye" /></button></td>
          </tr>)}</tbody>
        </table>
        {!visible.length && <FeatureEmptyState title="Không tìm thấy đề xuất" description="Thử đổi từ khóa hoặc bộ lọc, hoặc tạo một đề xuất mới." action={<button type="button" className="proposal-primary" onClick={openCreate}>Tạo đề xuất</button>} />}
      </div>
      <div className="proposal-list-footer"><span>Hiển thị {visible.length} / {filtered.length} đề xuất</span><FeaturePagination page={page} totalPages={totalPages} onChange={setPage} /></div>
    </div>
    {selected && <FeatureModal title={`Chi tiết ${selected.id}`} eyebrow="ĐỀ XUẤT GIA PHẢ" onClose={() => setSelected(null)} wide footer={<button type="button" className="feature-button primary" onClick={() => setSelected(null)}>Đóng</button>}>
      <div className="proposal-detail-head"><div className="proposal-person"><span>{selected.proposerInitial}</span><div><strong>{selected.proposerName}</strong><small>Người gửi · {selected.createdAt}</small></div></div><span className={`proposal-status ${selected.status}`}>{statusLabel[selected.status]}</span></div>
      <div className="proposal-detail-grid"><div><span>Hồ sơ liên quan</span><strong>{selected.targetName}</strong></div><div><span>Loại đề xuất</span><strong>{selected.type === 'profile' ? 'Cập nhật hồ sơ' : 'Quan hệ gia đình'}</strong></div><div className="full"><span>Nội dung / Quan hệ</span><strong>{selected.relationship}</strong></div><div><span>Dữ liệu hiện tại</span><strong>{selected.currentValue}</strong></div><div className="highlight"><span>Dữ liệu đề xuất</span><strong>{selected.proposedValue}</strong></div><div className="full"><span>Lý do và ghi chú</span><p>{selected.reason}</p></div>{selected.adminNote && <div className="full admin-note"><span>Phản hồi người duyệt</span><p>{selected.adminNote}</p></div>}</div>
    </FeatureModal>}
    {showCreate && <FeatureModal title="Tạo đề xuất mới" eyebrow="HỒ SƠ / QUAN HỆ" onClose={() => setShowCreate(false)} wide footer={<><button type="button" className="feature-button secondary" onClick={() => setShowCreate(false)}>Hủy</button><button type="submit" form="proposal-create-form" className="feature-button primary"><FeatureIcon name="check" /> Gửi đề xuất</button></>}>
      <form id="proposal-create-form" className="feature-form-grid" onSubmit={submitProposal} noValidate>
        <div className="feature-field"><label>Thành viên gia đình <em>*</em></label><select value={form.targetName} onChange={(event) => setForm({ ...form, targetName: event.target.value })}><option value="">Chọn thành viên</option><option>Nguyễn Văn An</option><option>Nguyễn Thị Lan</option><option>Nguyễn Đức Anh</option><option>Nguyễn Hoàng Long</option></select>{errors.targetName && <span className="feature-field-error">{errors.targetName}</span>}</div>
        <div className="feature-field"><label>Loại đề xuất <em>*</em></label><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as ProposalForm['type'], relationship: '' })}><option value="profile">Cập nhật hồ sơ</option><option value="relationship">Quan hệ gia đình</option></select></div>
        <div className="feature-field full"><label>{form.type === 'relationship' ? 'Quan hệ đề xuất' : 'Trường thông tin'} <em>*</em></label><select value={form.relationship} onChange={(event) => setForm({ ...form, relationship: event.target.value })}><option value="">Chọn nội dung</option>{form.type === 'relationship' ? <><option>Quan hệ cha – con</option><option>Quan hệ mẹ – con</option><option>Quan hệ vợ – chồng</option><option>Quan hệ anh – em</option></> : <><option>Ngày sinh</option><option>Nơi cư trú</option><option>Học vấn / nghề nghiệp</option><option>Tiểu sử</option></>}</select>{errors.relationship && <span className="feature-field-error">{errors.relationship}</span>}</div>
        <div className="feature-field"><label>Giá trị hiện tại</label><input value={form.currentValue} onChange={(event) => setForm({ ...form, currentValue: event.target.value })} placeholder="Nếu chưa có, có thể để trống" /></div>
        <div className="feature-field"><label>Giá trị đề xuất <em>*</em></label><input value={form.proposedValue} onChange={(event) => setForm({ ...form, proposedValue: event.target.value })} placeholder="Nhập thông tin mới" />{errors.proposedValue && <span className="feature-field-error">{errors.proposedValue}</span>}</div>
        <div className="feature-field full"><label>Lý do / Minh chứng <em>*</em></label><textarea value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Mô tả lý do và nguồn thông tin để người duyệt đối chiếu..." />{errors.reason && <span className="feature-field-error">{errors.reason}</span>}</div>
        <div className="feature-permission-note full"><FeatureIcon name="lock" /><span>Đề xuất chỉ cập nhật dữ liệu sau khi người có quyền quản trị dòng họ phê duyệt.</span></div>
      </form>
    </FeatureModal>}
    {toast && <FeatureToast message={toast} onClose={() => setToast('')} />}
  </section>;
};

export default MyProposalsModule;
