import React, { useEffect, useMemo, useState } from 'react';

import { useFamily } from '../../../context/FamilyContext';
import { getApiErrorMessage } from '../../../services/api';
import {
  createRelationship,
  deleteRelationship,
  getPersons,
  getTreeData,
} from '../../../services/genealogyService';
import type { PersonDto, RelationshipCreateDto, RelationshipDto } from '../../../types/sprint2';
import DataTable, { type Column } from '../../../shared/DataTable/DataTable';
import '../Branches/BranchesPage.css';
import './RelationshipsPage.css';

const EMPTY_FORM: RelationshipCreateDto = {
  fromMemberId: '',
  toMemberId: '',
  relationshipType: 'PARENT',
};

export const RelationshipsPage: React.FC = () => {
  const { currentFamilyId, error: familyError } = useFamily();
  const [relationships, setRelationships] = useState<RelationshipDto[]>([]);
  const [persons, setPersons] = useState<PersonDto[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<RelationshipCreateDto>(EMPTY_FORM);

  const load = async () => {
    if (!currentFamilyId) return;
    setLoading(true);
    setError('');
    try {
      const [tree, personRows] = await Promise.all([
        getTreeData(currentFamilyId),
        getPersons(currentFamilyId, { limit: 500 }),
      ]);
      setRelationships(tree.edges);
      setPersons(personRows);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không tải được quan hệ.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [currentFamilyId]);

  const names = useMemo(() => new Map(persons.map((person) => [person.id, person.fullName])), [persons]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return relationships.filter((relationship) => {
      const matchesType = !typeFilter || relationship.relationshipType === typeFilter;
      const matchesSearch = !query || [
        names.get(relationship.fromMemberId),
        names.get(relationship.toMemberId),
      ].some((name) => name?.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [relationships, names, search, typeFilter]);

  const save = async () => {
    if (!currentFamilyId) return;
    setSaving(true);
    setError('');
    try {
      await createRelationship(currentFamilyId, form);
      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      await load();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không tạo được quan hệ.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (relationship: RelationshipDto) => {
    if (!currentFamilyId || !window.confirm('Xóa quan hệ này?')) return;
    try {
      await deleteRelationship(currentFamilyId, relationship.id);
      await load();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Không xóa được quan hệ.'));
    }
  };

  const columns: Column<RelationshipDto>[] = [
    { key: 'from', header: 'Người thứ nhất', render: (item) => <strong className="text-blue-700">{names.get(item.fromMemberId) || item.fromMemberId}</strong> },
    { key: 'type', header: 'Mối quan hệ', render: (item) => <span className="rel-type-badge">{item.relationshipType}</span> },
    { key: 'to', header: 'Người thứ hai', render: (item) => <strong className="text-blue-700">{names.get(item.toMemberId) || item.toMemberId}</strong> },
    { key: 'details', header: 'Chi tiết', render: (item) => item.relationshipType === 'PARENT' ? 'Người 1 là cha/mẹ của Người 2' : 'Vợ / Chồng' },
    { key: 'actions', header: 'Thao tác', render: (item) => <button className="rel-btn-delete" onClick={() => void remove(item)}>Xoá</button> },
  ];

  if (!currentFamilyId) {
    return <div className="admin-account-container"><p>{familyError || 'Chưa chọn clan.'}</p></div>;
  }

  return (
    <div className="admin-account-container">
      <div className="admin-account-header">
        <div>
          <h2 className="admin-account-title">Quản lý Quan hệ</h2>
          <p className="admin-account-subtitle">PARENT và SPOUSE được Backend kiểm tra duplicate, cycle và family scope.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>+ Tạo Quan hệ mới</button>
      </div>

      {error && <div className="clan-profile-error">{error}</div>}
      <div className="rel-filter-bar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm theo tên người..." className="rel-search-input form-input-admin flex-1" />
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rel-type-select form-input-admin w-48">
          <option value="">Tất cả loại quan hệ</option>
          <option value="PARENT">Cha/Mẹ - Con</option>
          <option value="SPOUSE">Vợ - Chồng</option>
        </select>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} keyExtractor={(item) => item.id} emptyMessage="Chưa có dữ liệu quan hệ nào được ghi nhận." />

      {isModalOpen && (
        <div className="branch-modal-overlay">
          <div className="branch-modal-backdrop" onClick={() => setIsModalOpen(false)} />
          <div className="branch-modal-content relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="branch-modal-header"><h3 className="branch-modal-title">Tạo quan hệ</h3><button className="branch-modal-close" onClick={() => setIsModalOpen(false)}>✕</button></div>
            <div className="branch-modal-body">
              <label><span className="branch-modal-label">Loại quan hệ</span><select className="form-input-admin w-full" value={form.relationshipType} onChange={(event) => setForm({ ...form, relationshipType: event.target.value as 'PARENT' | 'SPOUSE' })}><option value="PARENT">PARENT</option><option value="SPOUSE">SPOUSE</option></select></label>
              <label><span className="branch-modal-label">Người thứ nhất {form.relationshipType === 'PARENT' ? '(cha/mẹ)' : ''}</span><select className="form-input-admin w-full" value={form.fromMemberId} onChange={(event) => setForm({ ...form, fromMemberId: event.target.value })}><option value="">Chọn Person</option>{persons.map((person) => <option key={person.id} value={person.id}>{person.fullName}</option>)}</select></label>
              <label><span className="branch-modal-label">Người thứ hai {form.relationshipType === 'PARENT' ? '(con)' : ''}</span><select className="form-input-admin w-full" value={form.toMemberId} onChange={(event) => setForm({ ...form, toMemberId: event.target.value })}><option value="">Chọn Person</option>{persons.map((person) => <option key={person.id} value={person.id}>{person.fullName}</option>)}</select></label>
            </div>
            <div className="branch-modal-footer"><button className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>Huỷ</button><button className="admin-btn-primary" disabled={saving || !form.fromMemberId || !form.toMemberId} onClick={() => void save()}>{saving ? 'Đang lưu...' : 'Lưu quan hệ'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipsPage;
