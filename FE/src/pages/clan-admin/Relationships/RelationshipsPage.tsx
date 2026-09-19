import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface Relationship {
  id: string;
  person1: string;
  person2: string;
  type: string;
  details: string;
  status: 'verified' | 'pending';
}

export const RelationshipsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  
  // Mock data
  const data: Relationship[] = [
    { id: '1', person1: 'Nguyễn Văn Khoa', person2: 'Nguyễn Văn A', type: 'Cha - Con', details: 'Con ruột', status: 'verified' },
    { id: '2', person1: 'Nguyễn Thị Hoa', person2: 'Trần Văn B', type: 'Vợ - Chồng', details: 'Kết hôn năm 2010', status: 'verified' },
  ];

  const columns: Column<Relationship>[] = [
    { key: 'person1', header: 'Người thứ nhất', render: (item) => <strong className="text-blue-700">{item.person1}</strong> },
    { key: 'type', header: 'Mối quan hệ', render: (item) => (
      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200 text-sm font-semibold">
        {item.type}
      </span>
    )},
    { key: 'person2', header: 'Người thứ hai', render: (item) => <strong className="text-blue-700">{item.person2}</strong> },
    { key: 'details', header: 'Chi tiết', render: (item) => item.details },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {item.status === 'verified' ? 'Đã xác nhận' : 'Chờ duyệt'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Sửa</button>
        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Xoá</button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Tạo Quan hệ mới
    </button>
  );

  return (
    <div className="page-container">
      <PageHeader 
        title="Quản lý Quan hệ" 
        subtitle="Quản lý quan hệ Cha/Mẹ - Con, Vợ/Chồng, Anh/Chị/Em giữa các nhân khẩu."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên người..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả loại quan hệ</option>
          <option value="parent">Cha/Mẹ - Con</option>
          <option value="spouse">Vợ - Chồng</option>
          <option value="sibling">Anh - Chị - Em</option>
        </select>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        keyExtractor={(item) => item.id} 
        emptyMessage="Chưa có dữ liệu quan hệ nào được ghi nhận."
      />
    </div>
  );
};

export default RelationshipsPage;
