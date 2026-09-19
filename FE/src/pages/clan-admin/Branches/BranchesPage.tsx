import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface Branch {
  id: string;
  name: string;
  leader: string;
  memberCount: number;
  location?: string;
  level: 'chi' | 'nhanh' | 'canh';
}

export const BranchesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Mock data
  const data: Branch[] = [
    { id: '1', name: 'Chi 1 (Đại Tôn)', leader: 'Nguyễn Trọng A', memberCount: 150, location: 'Hà Nội', level: 'chi' },
    { id: '2', name: 'Nhánh 1.1', leader: 'Nguyễn Văn B', memberCount: 45, location: 'Hải Phòng', level: 'nhanh' },
    { id: '3', name: 'Chi 2', leader: 'Nguyễn Đức C', memberCount: 80, location: 'Thanh Hóa', level: 'chi' },
  ];

  const getLevelLabel = (level: string) => {
    switch(level) {
      case 'chi': return 'Chi';
      case 'nhanh': return 'Nhánh';
      case 'canh': return 'Cành';
      default: return level;
    }
  }

  const columns: Column<Branch>[] = [
    { key: 'name', header: 'Tên Chi / Nhánh', render: (item) => <strong className="text-slate-800">{item.name}</strong> },
    { key: 'level', header: 'Cấp độ', render: (item) => (
      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">{getLevelLabel(item.level)}</span>
    )},
    { key: 'leader', header: 'Trưởng Chi/Nhánh', render: (item) => item.leader },
    { key: 'memberCount', header: 'Số lượng TV', render: (item) => `${item.memberCount} người` },
    { key: 'location', header: 'Địa bàn', render: (item) => item.location || '-' },
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded">Sửa</button>
        <button className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1">Xoá</button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Thêm Chi/Nhánh
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Quản lý Chi / Nhánh" 
        subtitle="Phân cấp hệ thống dòng họ theo Chi, Nhánh, Cành."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên chi nhánh, trưởng chi..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả cấp độ</option>
          <option value="chi">Chi</option>
          <option value="nhanh">Nhánh</option>
          <option value="canh">Cành</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={data} 
          keyExtractor={(item) => item.id} 
          emptyMessage="Chưa có dữ liệu phân Chi/Nhánh."
        />
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Thêm Chi / Nhánh mới</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cấp độ <span className="text-red-500">*</span></label>
                <select className="form-input-admin w-full">
                  <option value="chi">Chi</option>
                  <option value="nhanh">Nhánh</option>
                  <option value="canh">Cành</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên Chi/Nhánh <span className="text-red-500">*</span></label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Chi 3, Nhánh 1.2..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trực thuộc (Parent)</label>
                <select className="form-input-admin w-full">
                  <option value="">-- Không trực thuộc (Cấp cao nhất) --</option>
                  <option value="1">Chi 1 (Đại Tôn)</option>
                  <option value="3">Chi 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Người làm Trưởng Chi/Nhánh</label>
                <div className="flex gap-2">
                  <input type="text" className="form-input-admin flex-1" placeholder="Nhập ID hoặc Tên người đại diện..." />
                  <button className="btn-secondary whitespace-nowrap">Tìm kiếm</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa bàn / Quê quán</label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Hải Phòng" />
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Huỷ</button>
              <button className="btn-primary" onClick={() => { alert('Lưu thành công!'); setIsAddModalOpen(false); }}>Lưu dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesPage;
