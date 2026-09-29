import React, { useState } from 'react';
import './MyProposalsModule.css';

export interface ProposalItem {
  id: string;
  type: 'profile' | 'relationship';
  targetName: string;
  fieldOrRelation: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminNote?: string;
}

export const MyProposalsModule: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalItem[]>([
    {
      id: 'prop-001',
      type: 'profile',
      targetName: 'Nguyễn Văn A',
      fieldOrRelation: 'Trình độ học vấn',
      currentValue: 'Cử nhân',
      proposedValue: 'Thạc sĩ Khoa học Máy tính',
      reason: 'Bổ sung bằng cấp mới tốt nghiệp năm 2025.',
      status: 'pending',
      createdAt: '2026-09-10 14:30',
    },
    {
      id: 'prop-002',
      type: 'relationship',
      targetName: 'Nguyễn Văn B',
      fieldOrRelation: 'Quan hệ Con trai với Nguyễn Văn A',
      currentValue: 'Chưa gắn kết',
      proposedValue: 'Con trai',
      reason: 'Cập nhật con trai thứ 2 mới sinh.',
      status: 'approved',
      createdAt: '2026-09-01 09:15',
      adminNote: 'Đã xác minh giấy khai sinh và duyệt thành công.',
    },
    {
      id: 'prop-003',
      type: 'profile',
      targetName: 'Nguyễn Văn A',
      fieldOrRelation: 'Năm sinh',
      currentValue: '1985',
      proposedValue: '1983',
      reason: 'Sửa lại theo căn cước công dân.',
      status: 'rejected',
      createdAt: '2026-08-20 16:45',
      adminNote: 'Thông tin không khớp với trích lục khai sinh gia tộc.',
    },
  ]);

  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [proposalType, setProposalType] = useState<'profile' | 'relationship'>('profile');
  const [fieldOrRelation, setFieldOrRelation] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [reason, setReason] = useState('');

  const filteredProposals = proposals.filter((p) => {
    if (activeStatusTab === 'all') return true;
    return p.status === activeStatusTab;
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldOrRelation || !proposedValue || !reason) return;

    const newProp: ProposalItem = {
      id: `prop-${Date.now()}`,
      type: proposalType,
      targetName: 'Nguyễn Văn A',
      fieldOrRelation,
      currentValue: currentValue || 'N/A',
      proposedValue,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setProposals([newProp, ...proposals]);
    setShowCreateModal(false);
    // Reset form
    setFieldOrRelation('');
    setCurrentValue('');
    setProposedValue('');
    setReason('');
  };

  return (
    <div className="proposals-container">
      <div className="proposals-header">
        <div>
          <h2 className="proposals-title">Đề Xuất Chỉnh Sửa & Theo Dõi Phê Duyệt</h2>
          <p className="proposals-subtitle">
            Gửi yêu cầu điều chỉnh thông tin cá nhân hoặc quan hệ gia đình tới Quản trị viên dòng họ.
          </p>
        </div>
        <button className="create-proposal-btn" onClick={() => setShowCreateModal(true)}>
          + Tạo đề xuất mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="proposals-filter-tabs">
        <button
          className={`filter-tab ${activeStatusTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveStatusTab('all')}
        >
          Tất cả ({proposals.length})
        </button>
        <button
          className={`filter-tab ${activeStatusTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveStatusTab('pending')}
        >
          Chờ duyệt ({proposals.filter((p) => p.status === 'pending').length})
        </button>
        <button
          className={`filter-tab ${activeStatusTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveStatusTab('approved')}
        >
          Đã duyệt ({proposals.filter((p) => p.status === 'approved').length})
        </button>
        <button
          className={`filter-tab ${activeStatusTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveStatusTab('rejected')}
        >
          Từ chối ({proposals.filter((p) => p.status === 'rejected').length})
        </button>
      </div>

      {/* Proposal Cards List */}
      <div className="proposals-list">
        {filteredProposals.length === 0 ? (
          <div className="proposals-empty">Không có đề xuất nào trong danh mục này.</div>
        ) : (
          filteredProposals.map((item) => (
            <div key={item.id} className="proposal-card">
              <div className="proposal-card-head">
                <div className="proposal-badge-group">
                  <span className={`status-badge ${item.status}`}>
                    {item.status === 'pending' && 'Chờ duyệt'}
                    {item.status === 'approved' && 'Đã duyệt'}
                    {item.status === 'rejected' && 'Từ chối'}
                  </span>
                  <span className="type-badge">
                    {item.type === 'profile' ? 'Hồ sơ cá nhân' : 'Quan hệ gia đình'}
                  </span>
                </div>
                <span className="proposal-date">{item.createdAt}</span>
              </div>

              <h3 className="proposal-item-title">{item.fieldOrRelation}</h3>

              <div className="proposal-diff-grid">
                <div className="diff-box old">
                  <span className="diff-label">Dữ liệu hiện tại:</span>
                  <span className="diff-val">{item.currentValue}</span>
                </div>
                <div className="diff-arrow">➔</div>
                <div className="diff-box new">
                  <span className="diff-label">Dữ liệu đề xuất:</span>
                  <span className="diff-val">{item.proposedValue}</span>
                </div>
              </div>

              <div className="proposal-reason">
                <strong>Lý do & Minh chứng:</strong> {item.reason}
              </div>

              {item.adminNote && (
                <div className={`admin-note-box ${item.status}`}>
                  <strong>Phản hồi từ Admin:</strong> {item.adminNote}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal create proposal */}
      {showCreateModal && (
        <div className="proposal-modal-overlay">
          <div className="proposal-modal-card">
            <div className="proposal-modal-header">
              <h3 className="proposal-modal-title">Gửi Đề Xuất Thay Đổi Dữ Liệu</h3>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="proposal-modal-form">
              <div className="modal-field">
                <label className="modal-label">Loại đề xuất *</label>
                <select
                  className="modal-select"
                  value={proposalType}
                  onChange={(e) => setProposalType(e.target.value as any)}
                >
                  <option value="profile">Đề xuất sửa thông tin hồ sơ</option>
                  <option value="relationship">Đề xuất thêm / sửa quan hệ</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">
                  {proposalType === 'profile' ? 'Trường thông tin cần sửa *' : 'Mối quan hệ đề xuất *'}
                </label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder={proposalType === 'profile' ? 'VD: Trình độ học vấn, Nghề nghiệp' : 'VD: Thêm quan hệ Cha/Mẹ/Con/Vợ/Chồng'}
                  value={fieldOrRelation}
                  onChange={(e) => setFieldOrRelation(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Giá trị hiện tại (nếu có)</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Nhập dữ liệu cũ đang hiển thị"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Giá trị đề xuất mới *</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Nhập thông tin mới chính xác"
                  value={proposedValue}
                  onChange={(e) => setProposedValue(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Lý do & Minh chứng *</label>
                <textarea
                  className="modal-textarea"
                  rows={3}
                  placeholder="Mô tả chi tiết lý do đính kèm thông tin đính chính hoặc liên kết minh chứng"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="modal-submit-btn">
                  Gửi đề xuất duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProposalsModule;
