import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface MemorialDay {
  id: string;
  name: string;
  lunarDate: string;
  solarDate: string;
  location: string;
  status: 'upcoming' | 'passed';
}

export const MemorialDaysPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const data: MemorialDay[] = [
    { id: '1', name: 'Giỗ Cụ Thủy Tổ Nguyễn Bặc', lunarDate: '15/08', solarDate: '26/09/2026', location: 'Nhà thờ họ Đại Tôn', status: 'upcoming' },
    { id: '2', name: 'Giỗ Cụ Nguyễn Trãi', lunarDate: '16/08', solarDate: '27/09/2026', location: 'Từ đường Chi 1', status: 'upcoming' },
  ];

  const columns: Column<MemorialDay>[] = [
    { key: 'name', header: 'Ngày Giỗ', render: (item) => <strong className="text-slate-800">{item.name}</strong> },
    { key: 'lunarDate', header: 'Ngày Âm lịch', render: (item) => <span className="font-bold text-red-600">{item.lunarDate}</span> },
    { key: 'solarDate', header: 'Ngày Dương lịch (năm nay)', render: (item) => item.solarDate },
    { key: 'location', header: 'Địa điểm tổ chức', render: (item) => item.location },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
        {item.status === 'upcoming' ? 'Sắp tới' : 'Đã qua'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded">Sửa</button>
        <button className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1">Xoá</button>
      </div>
    )},
  ];

  const headerActions = (
    <div className="flex gap-2">
      <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
        <button 
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          onClick={() => setViewMode('list')}
        >Danh sách</button>
        <button 
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${viewMode === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          onClick={() => setViewMode('calendar')}
        >Lịch biểu</button>
      </div>
      <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Thêm Ngày Giỗ
      </button>
    </div>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Quản lý Ngày Giỗ" 
        subtitle="Quản lý danh sách ngày giỗ, lịch cúng tế và hệ thống tự động nhắc nhở."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tháng Âm lịch</option>
          <option value="1">Tháng 1</option>
          <option value="8">Tháng 8</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
        {viewMode === 'list' ? (
          <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} emptyMessage="Chưa có thông tin ngày giỗ." />
        ) : (
          <div className="p-8 text-center">
            {/* Calendar Mock */}
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Tháng 8 / 2026 (Âm lịch)</h3>
                <div className="flex gap-2">
                  <button className="btn-secondary">Tháng trước</button>
                  <button className="btn-secondary">Tháng sau</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                  <div key={d} className="font-bold text-slate-500 py-2">{d}</div>
                ))}
                {Array.from({length: 30}).map((_, i) => {
                  const day = i + 1;
                  const isGio = day === 15 || day === 16;
                  return (
                    <div key={day} className={`aspect-square border rounded-lg p-2 text-left relative transition-colors ${isGio ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <span className={`font-semibold ${isGio ? 'text-amber-700' : 'text-slate-700'}`}>{day}</span>
                      {isGio && (
                        <div className="absolute bottom-2 left-2 right-2 text-[0.65rem] bg-amber-500 text-white p-1 rounded font-medium leading-tight truncate">
                          {day === 15 ? 'Giỗ Nguyễn Bặc' : 'Giỗ Nguyễn Trãi'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Thêm Lịch Ngày Giỗ</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề (Tên người được giỗ) <span className="text-red-500">*</span></label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Giỗ Ông Nội..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày (Âm lịch) <span className="text-red-500">*</span></label>
                  <select className="form-input-admin w-full">
                    {Array.from({length: 30}).map((_, i) => <option key={i+1} value={i+1}>Mùng {i+1}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tháng (Âm lịch) <span className="text-red-500">*</span></label>
                  <select className="form-input-admin w-full">
                    {Array.from({length: 12}).map((_, i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa điểm tổ chức</label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Nhà thờ tổ Chi 1..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú thêm</label>
                <textarea className="form-input-admin w-full" rows={3} placeholder="Người chịu trách nhiệm, vật phẩm..."></textarea>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="notify" className="w-4 h-4 text-blue-600 rounded border-slate-300" defaultChecked />
                <label htmlFor="notify" className="text-sm text-slate-700">Tự động gửi thông báo cho các thành viên liên quan trước 3 ngày</label>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Huỷ</button>
              <button className="btn-primary" onClick={() => { alert('Lưu thành công!'); setIsAddModalOpen(false); }}>Lưu lịch giỗ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemorialDaysPage;
