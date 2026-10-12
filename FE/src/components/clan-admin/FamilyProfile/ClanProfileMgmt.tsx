import React, { useEffect, useState } from 'react';

import { useFamily } from '../../../context/FamilyContext';
import { getApiErrorMessage } from '../../../services/api';
import { getBranches, updateFamily } from '../../../services/familyService';
import type { BranchDto, FamilyUpdateDto } from '../../../types/sprint2';
import PageHeader from '../../../shared/Layout/PageHeader';
import './ClanProfileMgmt.css';

export const ClanProfileMgmt: React.FC = () => {
  const { currentFamilyId, currentFamily, loading, error: familyError, refreshFamily } = useFamily();
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<FamilyUpdateDto>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentFamilyId) return;
    getBranches(currentFamilyId)
      .then(setBranches)
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, [currentFamilyId]);

  const openEdit = () => {
    if (!currentFamily) return;
    setEditForm({
      name: currentFamily.name,
      clanCode: currentFamily.clanCode,
      status: currentFamily.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentFamilyId) return;
    setSaving(true);
    setError('');
    try {
      await updateFamily(currentFamilyId, editForm);
      await refreshFamily();
      setMessage('Đã cập nhật thông tin clan trên Backend.');
      setIsEditModalOpen(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không cập nhật được clan.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="clan-profile-loading">Đang tải thông tin dòng họ...</div>;
  if (!currentFamily) {
    return <div className="clan-profile-error">{familyError || 'Chưa resolve được clan hiện tại.'}</div>;
  }

  return (
    <div className="admin-account-container">
      <PageHeader
        title="Hồ Sơ Dòng Họ"
        subtitle="Dữ liệu thật từ Backend Sprint 2 và Neon dev_vanthang."
        actions={<button className="admin-btn-primary" onClick={openEdit}>Chỉnh sửa thông tin</button>}
      />

      {message && <div className="clan-profile-alert">{message}</div>}
      {error && <div className="clan-profile-error">{error}</div>}

      <div className="family-cards-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Thông Tin Chung</h3>
            <span className="clan-profile-badge badge-role-pill acc-role-member">{currentFamily.status}</span>
          </div>
          <div className="admin-card-body">
            <div className="clan-profile-info-group">
              <div>
                <div className="clan-profile-info-label">Tên dòng họ</div>
                <div className="clan-profile-info-value">{currentFamily.name}</div>
              </div>
              <div>
                <div className="clan-profile-info-label">Mã clan</div>
                <div className="clan-profile-info-subvalue">{currentFamily.clanCode}</div>
              </div>
              <div>
                <div className="clan-profile-info-label">Thông tin mở rộng</div>
                <div className="clan-profile-history-box">
                  Founder, quê quán và lịch sử chưa có trong contract Sprint 2 hiện tại.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="clan-profile-side-group">
          <div className="admin-card">
            <div className="admin-card-header"><h3>Các Chi / Nhánh ({branches.length})</h3></div>
            <div className="admin-card-body clan-profile-card-body-no-pad">
              {branches.length === 0 ? (
                <div className="clan-profile-history-box">Chưa có chi/nhánh.</div>
              ) : (
                <ul className="clan-profile-branch-list">
                  {branches.map((branch, index) => (
                    <li key={branch.id} className={`clan-profile-branch-item ${index < branches.length - 1 ? 'border-bottom' : ''}`}>
                      <div>
                        <div className="clan-profile-branch-name">{branch.name}</div>
                        <div className="clan-profile-branch-head">{branch.code || 'Chưa có mã'}</div>
                      </div>
                      <span className="clan-profile-member-count badge-role-pill status-badge-locked">
                        {branch.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="clan-modal-overlay">
          <div className="clan-modal-box">
            <div className="clan-modal-header">
              <h3>Chỉnh Sửa Hồ Sơ Dòng Họ</h3>
              <button className="clan-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <div className="clan-profile-modal-body">
              <label className="form-group-admin">
                <span className="form-label-admin">Tên dòng họ</span>
                <input className="form-input-admin" value={editForm.name || ''} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} />
              </label>
              <label className="form-group-admin">
                <span className="form-label-admin">Mã clan</span>
                <input className="form-input-admin" value={editForm.clanCode || ''} onChange={(event) => setEditForm({ ...editForm, clanCode: event.target.value })} />
              </label>
            </div>
            <div className="clan-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
              <button className="admin-btn-primary" disabled={saving} onClick={() => void handleSave()}>
                {saving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanProfileMgmt;
