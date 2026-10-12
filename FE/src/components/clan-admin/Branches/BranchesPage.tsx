import React, { useEffect, useMemo, useState } from 'react';

import { useFamily } from '../../../context/FamilyContext';
import { getApiErrorMessage } from '../../../services/api';
import { createBranch, getBranches, updateBranch } from '../../../services/familyService';
import type { BranchDto, BranchWriteDto } from '../../../types/sprint2';
import DataTable, { type Column } from '../../../shared/DataTable/DataTable';
import './BranchesPage.css';

const EMPTY_FORM: BranchWriteDto = {
  name: '',
  code: '',
  parentBranchId: null,
  branchOrder: 0,
  description: '',
  status: 'ACTIVE',
};

export const BranchesPage: React.FC = () => {
  const { currentFamilyId, error: familyError } = useFamily();
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<BranchDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<BranchWriteDto>(EMPTY_FORM);

  const loadBranches = async () => {
    if (!currentFamilyId) return;
    setLoading(true);
    setError('');
    try {
      setBranches(await getBranches(currentFamilyId));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không tải được danh sách chi/nhánh.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBranches();
  }, [currentFamilyId]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((branch) =>
      [branch.name, branch.code, branch.description].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [branches, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (branch: BranchDto) => {
    setEditing(branch);
    setForm({
      name: branch.name,
      code: branch.code || '',
      parentBranchId: branch.parentBranchId || null,
      branchOrder: branch.branchOrder,
      description: branch.description || '',
      status: branch.status,
    });
    setIsModalOpen(true);
  };

  const save = async () => {
    if (!currentFamilyId || !form.name?.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, name: form.name.trim() };
      if (editing) await updateBranch(currentFamilyId, editing.id, payload);
      else await createBranch(currentFamilyId, payload);
      setIsModalOpen(false);
      await loadBranches();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không lưu được chi/nhánh.'));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<BranchDto>[] = [
    { key: 'name', header: 'Tên Chi / Nhánh', render: (item) => <strong className="text-slate-800">{item.name}</strong> },
    { key: 'code', header: 'Mã', render: (item) => item.code || '—' },
    {
      key: 'parent',
      header: 'Trực thuộc',
      render: (item) => branches.find((branch) => branch.id === item.parentBranchId)?.name || 'Cấp cao nhất',
    },
    { key: 'order', header: 'Thứ tự', render: (item) => item.branchOrder },
    { key: 'status', header: 'Trạng thái', render: (item) => item.status },
    { key: 'actions', header: 'Thao tác', render: (item) => <button className="branch-btn-edit" onClick={() => openEdit(item)}>Sửa</button> },
  ];

  if (!currentFamilyId) {
    return <div className="admin-account-container"><p>{familyError || 'Chưa chọn clan.'}</p></div>;
  }

  return (
    <div className="admin-account-container">
      <div className="admin-account-header">
        <div>
          <h2 className="admin-account-title">Quản lý Chi / Nhánh</h2>
          <p className="admin-account-subtitle">Dữ liệu branches từ Backend Sprint 2.</p>
        </div>
        <button className="admin-btn-primary" onClick={openCreate}>+ Thêm Chi/Nhánh</button>
      </div>

      {error && <div className="clan-profile-error">{error}</div>}
      <div className="branch-filter-bar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm tên, mã hoặc mô tả..."
          className="branch-search-input form-input-admin flex-1"
        />
      </div>

      <div className="branch-table-container">
        <DataTable columns={columns} data={filtered} isLoading={loading} keyExtractor={(item) => item.id} emptyMessage="Chưa có dữ liệu phân Chi/Nhánh." />
      </div>

      {isModalOpen && (
        <div className="branch-modal-overlay">
          <div className="branch-modal-backdrop" onClick={() => setIsModalOpen(false)} />
          <div className="branch-modal-content relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="branch-modal-header">
              <h3 className="branch-modal-title">{editing ? 'Sửa Chi / Nhánh' : 'Thêm Chi / Nhánh mới'}</h3>
              <button className="branch-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="branch-modal-body">
              <label>
                <span className="branch-modal-label">Tên *</span>
                <input className="branch-modal-input form-input-admin w-full" value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label>
                <span className="branch-modal-label">Mã</span>
                <input className="branch-modal-input form-input-admin w-full" value={form.code || ''} onChange={(event) => setForm({ ...form, code: event.target.value })} />
              </label>
              <label>
                <span className="branch-modal-label">Trực thuộc</span>
                <select className="branch-modal-input form-input-admin w-full" value={form.parentBranchId || ''} onChange={(event) => setForm({ ...form, parentBranchId: event.target.value || null })}>
                  <option value="">Cấp cao nhất</option>
                  {branches.filter((branch) => branch.id !== editing?.id).map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                </select>
              </label>
              <label>
                <span className="branch-modal-label">Thứ tự</span>
                <input type="number" className="branch-modal-input form-input-admin w-full" value={form.branchOrder || 0} onChange={(event) => setForm({ ...form, branchOrder: Number(event.target.value) })} />
              </label>
              <label>
                <span className="branch-modal-label">Mô tả</span>
                <textarea className="branch-modal-input form-input-admin w-full" value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </label>
            </div>
            <div className="branch-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Huỷ</button>
              <button className="admin-btn-primary" disabled={saving || !form.name?.trim()} onClick={() => void save()}>{saving ? 'Đang lưu...' : 'Lưu dữ liệu'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesPage;
