import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface Ancestor {
  id: string;
  name: string;
  generation: number;
  birthYear?: number;
  deathYear?: number;
  title?: string;
  status: 'active' | 'inactive';
}

export const AncestorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(null);
  
  // Mock data
  const data: Ancestor[] = [
    { id: '1', name: 'Nguyễn Bặc', generation: 1, title: 'Định Quốc Công', status: 'active' },
    { id: '2', name: 'Nguyễn Trãi', generation: 5, birthYear: 1380, deathYear: 1442, title: 'Ức Trai', status: 'active' },
  ];

  const columns: Column<Ancestor>[] = [
    { key: 'name', header: 'Tên Thuỷ tổ / Tiên tổ', render: (item) => (
      <strong 
        className="text-blue-600 cursor-pointer hover:underline"
        onClick={() => setSelectedAncestor(item)}
      >
        {item.name}
      </strong>
    )},
    { key: 'generation', header: 'Đời thứ', render: (item) => `Đời ${item.generation}` },
    { key: 'years', header: 'Năm sinh - mất', render: (item) => `${item.birthYear || '?'} - ${item.deathYear || '?'}` },
    { key: 'title', header: 'Tước hiệu / Biệt hiệu', render: (item) => item.title || '-' },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
        {item.status === 'active' ? 'Hiển thị' : 'Đã ẩn'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Sửa</button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Thêm Thuỷ tổ
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Quản lý Thuỷ tổ" 
        subtitle="Thông tin về Thuỷ tổ và các Tiên tổ đời đầu của dòng họ."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên, tước hiệu..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả các đời</option>
          <option value="1">Đời 1</option>
          <option value="2">Đời 2</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={data} 
          keyExtractor={(item) => item.id} 
          emptyMessage="Chưa có thông tin Thuỷ tổ nào được cập nhật."
        />
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Thêm Thuỷ tổ / Tiên tổ</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên Thuỷ tổ <span className="text-red-500">*</span></label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Nguyễn Bặc" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Năm sinh</label>
                  <input type="number" className="form-input-admin w-full" placeholder="Ví dụ: 924" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Năm mất</label>
                  <input type="number" className="form-input-admin w-full" placeholder="Ví dụ: 979" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tước hiệu / Biệt hiệu</label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Định Quốc Công" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiểu sử tóm tắt</label>
                <textarea className="form-input-admin w-full" rows={3} placeholder="Mô tả công trạng..."></textarea>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Huỷ</button>
              <button className="btn-primary" onClick={() => { alert('Lưu thành công!'); setIsAddModalOpen(false); }}>Lưu Thuỷ tổ</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAncestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAncestor(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Chi tiết Tiên tổ</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setSelectedAncestor(null)}>✕</button>
            </div>
            <div className="p-6 flex-1 overflow-auto">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-blue-600 border-4 border-white shadow-md">
                  {selectedAncestor.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{selectedAncestor.name}</h2>
                <p className="text-sm text-slate-500">{selectedAncestor.title || 'Không có tước hiệu'}</p>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mt-3">Đời {selectedAncestor.generation}</span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Năm sinh - Năm mất</div>
                  <div className="font-medium text-slate-800">{selectedAncestor.birthYear || '?'} - {selectedAncestor.deathYear || '?'}</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Tiểu sử & Công trạng</div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    Đây là phần nội dung chi tiết về tiểu sử, nguồn gốc và những công trạng của vị Thủy tổ đối với dòng họ và đất nước. Nội dung này sẽ được hiển thị trên không gian truyền thống để con cháu đời sau học tập.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AncestorsPage;
