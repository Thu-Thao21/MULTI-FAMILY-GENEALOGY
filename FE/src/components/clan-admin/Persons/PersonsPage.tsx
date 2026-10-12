import React, { useEffect, useMemo, useState } from 'react';

import { useFamily } from '../../../context/FamilyContext';
import { getApiErrorMessage } from '../../../services/api';
import { getBranches } from '../../../services/familyService';
import {
  createPerson,
  getAncestors,
  getDescendants,
  getPerson,
  getPersons,
  updatePerson,
} from '../../../services/genealogyService';
import type { BranchDto, LineageDto, PersonDto, PersonWriteDto } from '../../../types/sprint2';
import DataTable, { type Column } from '../../../shared/DataTable/DataTable';
import './PersonsPage.css';

const EMPTY_FORM: PersonWriteDto = {
  fullName: '',
  branchId: null,
  gender: 'unknown',
  birthDate: null,
  deathDate: null,
  isLiving: true,
  status: 'ACTIVE',
};

export const PersonsPage: React.FC = () => {
  const { currentFamilyId, error: familyError } = useFamily();
  const [persons, setPersons] = useState<PersonDto[]>([]);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('');
  const [livingFilter, setLivingFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonDto | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'relationships' | 'account' | 'history'>('overview');
  const [ancestors, setAncestors] = useState<LineageDto[]>([]);
  const [descendants, setDescendants] = useState<LineageDto[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<PersonDto | null>(null);
  const [form, setForm] = useState<PersonWriteDto>(EMPTY_FORM);

  const loadPersons = async () => {
    if (!currentFamilyId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getPersons(currentFamilyId, {
        search: search.trim() || undefined,
        branchId: branchId || undefined,
        isLiving: livingFilter === '' ? undefined : livingFilter === 'true',
        limit: 500,
      });
      setPersons(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không tải được danh sách Person.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentFamilyId) return;
    getBranches(currentFamilyId).then(setBranches).catch(() => setBranches([]));
  }, [currentFamilyId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPersons(), 250);
    return () => window.clearTimeout(timeout);
  }, [currentFamilyId, search, branchId, livingFilter]);

  useEffect(() => {
    if (!currentFamilyId || !selectedPerson || detailTab !== 'relationships') return;
    Promise.all([
      getAncestors(currentFamilyId, selectedPerson.id),
      getDescendants(currentFamilyId, selectedPerson.id),
    ])
      .then(([ancestorRows, descendantRows]) => {
        setAncestors(ancestorRows);
        setDescendants(descendantRows);
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, [currentFamilyId, selectedPerson?.id, detailTab]);

  const branchNames = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch.name])),
    [branches],
  );

  const openDetail = async (person: PersonDto) => {
    if (!currentFamilyId) return;
    setError('');
    try {
      setSelectedPerson(await getPerson(currentFamilyId, person.id));
      setDetailTab('overview');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (person: PersonDto) => {
    setEditing(person);
    setForm({
      fullName: person.fullName,
      branchId: person.branchId || null,
      gender: person.gender,
      birthDate: person.birthDate || null,
      deathDate: person.deathDate || null,
      isLiving: person.isLiving,
      status: person.status,
    });
    setIsFormOpen(true);
  };

  const save = async () => {
    if (!currentFamilyId || !form.fullName?.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload: PersonWriteDto = { ...form, fullName: form.fullName.trim() };
      const saved = editing
        ? await updatePerson(currentFamilyId, editing.id, payload)
        : await createPerson(currentFamilyId, payload);
      setIsFormOpen(false);
      setSelectedPerson(saved);
      await loadPersons();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không lưu được Person.'));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<PersonDto>[] = [
    { key: 'name', header: 'Họ và tên', render: (item) => <strong className="text-slate-800">{item.fullName}</strong> },
    { key: 'gender', header: 'Giới tính', render: (item) => item.gender },
    { key: 'birthDate', header: 'Ngày sinh', render: (item) => item.birthDate || '—' },
    { key: 'generation', header: 'Đời thứ', render: (item) => `Đời ${item.generation}` },
    { key: 'branch', header: 'Thuộc Chi/Nhánh', render: (item) => item.branchId ? branchNames.get(item.branchId) || item.branchId : '—' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item) => (
        <span className={`person-status-badge ${item.isLiving ? 'status-alive' : 'status-deceased'}`}>
          {item.isLiving ? 'Còn sống' : 'Đã mất'}
        </span>
      ),
    },
    { key: 'actions', header: 'Thao tác', render: (item) => <button className="persons-btn-detail" onClick={() => void openDetail(item)}>Chi tiết</button> },
  ];

  if (!currentFamilyId) {
    return <div className="admin-account-container"><p>{familyError || 'Chưa chọn clan.'}</p></div>;
  }

  return (
    <div className="admin-account-container">
      <div className="admin-account-header">
        <div>
          <h2 className="admin-account-title">Quản lý Person (Nhân khẩu)</h2>
          <p className="admin-account-subtitle">Tìm kiếm, tạo và cập nhật Person qua Backend Sprint 2.</p>
        </div>
        <div className="persons-header-actions">
          <button className="admin-btn-secondary" disabled title="API GAP: chưa có import endpoint">Import Excel</button>
          <button className="admin-btn-primary" onClick={openCreate}>+ Thêm Nhân khẩu</button>
        </div>
      </div>

      {error && <div className="clan-profile-error">{error}</div>}
      <div className="persons-filter-bar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm họ tên..." className="persons-search-input form-input-admin flex-1" />
        <select value={branchId} onChange={(event) => setBranchId(event.target.value)} className="persons-branch-select form-input-admin w-48">
          <option value="">Tất cả Chi/Nhánh</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
        <select value={livingFilter} onChange={(event) => setLivingFilter(event.target.value)} className="persons-status-select form-input-admin w-48">
          <option value="">Tất cả trạng thái</option>
          <option value="true">Còn sống</option>
          <option value="false">Đã mất</option>
        </select>
      </div>

      <div className="persons-table-container">
        <DataTable columns={columns} data={persons} isLoading={loading} keyExtractor={(item) => item.id} emptyMessage="Không tìm thấy nhân khẩu nào." />
      </div>

      {selectedPerson && (
        <div className="persons-modal-overlay">
          <div className="persons-modal-backdrop" onClick={() => setSelectedPerson(null)} />
          <div className="persons-modal-content relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] animate-zoom-in overflow-hidden">
            <div className="persons-modal-header">
              <div className="persons-modal-header-left">
                <div className="persons-modal-avatar">{selectedPerson.fullName.charAt(0)}</div>
                <div>
                  <h2 className="persons-modal-name">{selectedPerson.fullName}</h2>
                  <p className="text-slate-500">Đời {selectedPerson.generation} • {selectedPerson.branchId ? branchNames.get(selectedPerson.branchId) || 'Chi chưa rõ' : 'Chưa phân chi'}</p>
                </div>
              </div>
              <button className="persons-modal-close" onClick={() => setSelectedPerson(null)}>✕</button>
            </div>
            <div className="persons-modal-tabs">
              {(['overview', 'relationships', 'account', 'history'] as const).map((tab) => (
                <button key={tab} className={`person-tab-btn ${detailTab === tab ? 'tab-active' : 'tab-inactive'}`} onClick={() => setDetailTab(tab)}>
                  {tab === 'overview' ? 'Tổng quan' : tab === 'relationships' ? 'Phả hệ' : tab === 'account' ? 'Tài khoản' : 'Lịch sử'}
                </button>
              ))}
            </div>
            <div className="persons-modal-body">
              {detailTab === 'overview' && (
                <div className="persons-detail-section">
                  <h3 className="persons-detail-title">Thông tin cơ bản</h3>
                  <div className="persons-detail-grid">
                    <div><span className="persons-detail-label">Ngày sinh</span><strong>{selectedPerson.birthDate || '—'}</strong></div>
                    <div><span className="persons-detail-label">Ngày mất</span><strong>{selectedPerson.deathDate || '—'}</strong></div>
                    <div><span className="persons-detail-label">Giới tính</span><strong>{selectedPerson.gender}</strong></div>
                    <div><span className="persons-detail-label">Trạng thái</span><strong>{selectedPerson.status}</strong></div>
                  </div>
                  <div className="persons-detail-actions"><button className="admin-btn-primary" onClick={() => openEdit(selectedPerson)}>Chỉnh sửa Hồ sơ</button></div>
                </div>
              )}
              {detailTab === 'relationships' && (
                <div className="space-y-4">
                  <div className="persons-rel-row"><div><span className="persons-rel-label">Tổ tiên</span>{ancestors.length ? ancestors.map((item) => <p key={item.person.id}>{item.person.fullName} (cách {item.depth} đời)</p>) : <p className="persons-rel-empty">Không có dữ liệu</p>}</div></div>
                  <div className="persons-rel-row"><div><span className="persons-rel-label">Hậu duệ</span>{descendants.length ? descendants.map((item) => <p key={item.person.id}>{item.person.fullName} (cách {item.depth} đời)</p>) : <p className="persons-rel-empty">Không có dữ liệu</p>}</div></div>
                </div>
              )}
              {detailTab === 'account' && <div className="persons-account-section"><p>API GAP: Sprint 2 chưa có endpoint liên kết Person với user.</p></div>}
              {detailTab === 'history' && <div className="persons-history-section"><p>API GAP: Sprint 2 chưa có audit-history endpoint cho Person.</p></div>}
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="persons-modal-overlay">
          <div className="persons-modal-backdrop" onClick={() => setIsFormOpen(false)} />
          <div className="persons-modal-content relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="persons-modal-header"><h2>{editing ? 'Cập nhật Person' : 'Thêm Person'}</h2><button className="persons-modal-close" onClick={() => setIsFormOpen(false)}>✕</button></div>
            <div className="persons-modal-body space-y-4">
              <label className="form-group-admin"><span className="form-label-admin">Họ tên *</span><input className="form-input-admin" value={form.fullName || ''} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></label>
              <label className="form-group-admin"><span className="form-label-admin">Giới tính</span><select className="form-input-admin" value={form.gender || 'unknown'} onChange={(event) => setForm({ ...form, gender: event.target.value })}><option value="unknown">Chưa rõ</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></select></label>
              <label className="form-group-admin"><span className="form-label-admin">Chi/Nhánh</span><select className="form-input-admin" value={form.branchId || ''} onChange={(event) => setForm({ ...form, branchId: event.target.value || null })}><option value="">Chưa phân chi</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
              <label className="form-group-admin"><span className="form-label-admin">Ngày sinh</span><input type="date" className="form-input-admin" value={form.birthDate || ''} onChange={(event) => setForm({ ...form, birthDate: event.target.value || null })} /></label>
              <label className="form-group-admin"><span className="form-label-admin">Ngày mất</span><input type="date" className="form-input-admin" value={form.deathDate || ''} onChange={(event) => setForm({ ...form, deathDate: event.target.value || null, isLiving: !event.target.value })} /></label>
            </div>
            <div className="persons-detail-actions"><button className="admin-btn-secondary" onClick={() => setIsFormOpen(false)}>Huỷ</button><button className="admin-btn-primary" disabled={saving || !form.fullName?.trim()} onClick={() => void save()}>{saving ? 'Đang lưu...' : 'Lưu Person'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonsPage;
