import React, { useState } from 'react';
import { submitRoleRequest } from '../../services/roleRequest.service';
import './RoleRequestModal.css';

interface RoleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RoleRequestModal: React.FC<RoleRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [familyId, setFamilyId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await submitRoleRequest({
        requested_role: 'family_head',
        family_id: familyId.trim() || undefined,
        reason: reason.trim() || undefined,
      });
      setSuccessMsg('Gửi yêu cầu làm Trưởng Họ thành công! Đang chờ Admin phê duyệt.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Gửi yêu cầu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Yêu cầu quyền Trưởng Họ</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>

        {error ? <div className="modal-error">❌ {error}</div> : null}
        {successMsg ? <div className="modal-success">✅ {successMsg}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mã dòng họ (Tùy chọn)</label>
            <input
              type="text"
              className="form-input"
              placeholder="VD: FAM_LE_01 hoặc để trống"
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lý do yêu cầu làm Trưởng Họ</label>
            <textarea
              className="form-textarea"
              placeholder="Mô tả vai trò dòng họ hoặc thông tin đại diện dòng họ của bạn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleRequestModal;
