import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface Person {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  generation: number;
  branch: string;
  status: 'alive' | 'deceased';
}

export const PersonsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'relationships' | 'account' | 'history'>('overview');
  
  // Mock data
  const data: Person[] = [
    { id: '1', name: 'Nguyễn Văn Khoa', gender: 'Nam', dob: '15/08/1990', generation: 15, branch: 'Chi 1', status: 'alive' },
    { id: '2', name: 'Nguyễn Thị Hoa', gender: 'Nữ', dob: '20/10/1985', generation: 15, branch: 'Nhánh 1.2', status: 'alive' },
    { id: '3', name: 'Nguyễn Văn Cụ', gender: 'Nam', dob: '01/01/1920', generation: 13, branch: 'Đại Tôn', status: 'deceased' },
  ];

  const columns: Column<Person>[] = [
    { key: 'name', header: 'Họ và tên', render: (item) => <strong className="text-slate-800">{item.name}</strong> },
    { key: 'gender', header: 'Giới tính', render: (item) => item.gender },
    { key: 'dob', header: 'Năm sinh', render: (item) => item.dob },
    { key: 'generation', header: 'Đời thứ', render: (item) => `Đời ${item.generation}` },
    { key: 'branch', header: 'Thuộc Chi/Nhánh', render: (item) => item.branch },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'alive' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
        {item.status === 'alive' ? 'Còn sống' : 'Đã mất'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <div className="flex gap-2">
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => setSelectedPerson(item)}
        >
          Chi tiết
        </button>
      </div>
    )},
  ];

  const headerActions = (
    <div className="flex gap-2">
      <button className="btn-secondary">Import Excel</button>
      <button className="btn-primary bg-slate-800 hover:bg-slate-900 border-slate-800 text-white flex gap-2 items-center">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
        Gộp trùng lặp
      </button>
      <button className="btn-primary">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Thêm Nhân khẩu
      </button>
    </div>
  );

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Quản lý Person (Nhân khẩu)" 
        subtitle="Danh sách toàn bộ nhân khẩu trong dòng họ."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên, CCCD..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả Chi/Nhánh</option>
          <option value="chi1">Chi 1</option>
        </select>
        <select className="form-input-admin w-48">
          <option value="">Trạng thái</option>
          <option value="alive">Còn sống</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={data} 
          keyExtractor={(item) => item.id} 
          emptyMessage="Không tìm thấy nhân khẩu nào."
        />
      </div>

      {/* Centered Modal for Person Detail */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPerson(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-400 text-2xl font-bold">
                  {selectedPerson.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedPerson.name}</h2>
                  <p className="text-slate-500">Đời {selectedPerson.generation} • {selectedPerson.branch}</p>
                </div>
              </div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
                onClick={() => setSelectedPerson(null)}
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-slate-200 px-6">
              <button className={`py-4 px-4 font-semibold text-sm border-b-2 ${detailTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setDetailTab('overview')}>Tổng quan</button>
              <button className={`py-4 px-4 font-semibold text-sm border-b-2 ${detailTab === 'relationships' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setDetailTab('relationships')}>Quan hệ Gia đình</button>
              <button className={`py-4 px-4 font-semibold text-sm border-b-2 ${detailTab === 'account' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setDetailTab('account')}>Tài khoản & Phân quyền</button>
              <button className={`py-4 px-4 font-semibold text-sm border-b-2 ${detailTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`} onClick={() => setDetailTab('history')}>Lịch sử & Cập nhật</button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 block mb-1">Ngày sinh</span><strong className="text-slate-800">{selectedPerson.dob}</strong></div>
                      <div><span className="text-slate-500 block mb-1">Giới tính</span><strong className="text-slate-800">{selectedPerson.gender}</strong></div>
                      <div><span className="text-slate-500 block mb-1">Tình trạng</span><strong className="text-slate-800">{selectedPerson.status === 'alive' ? 'Còn sống' : 'Đã mất'}</strong></div>
                      <div><span className="text-slate-500 block mb-1">Nơi ở hiện tại</span><strong className="text-slate-800">Hà Nội, Việt Nam</strong></div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                      <button className="btn-primary" onClick={() => alert('Tính năng Chỉnh sửa Hồ sơ đang được phát triển.')}>Chỉnh sửa Hồ sơ</button>
                      <button className="btn-secondary border-red-200 text-red-600 hover:bg-red-50" onClick={() => alert('Đã ẩn nhân khẩu này khỏi danh sách.')}>Ẩn Nhân khẩu (Hide)</button>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'relationships' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cha mẹ</span>
                      <p className="font-bold text-slate-800 mt-1">Nguyễn Văn Cha <span className="text-sm font-normal text-slate-500 ml-2">(Đời {selectedPerson.generation - 1})</span></p>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:underline" onClick={() => alert('Đang mở form chỉnh sửa quan hệ...')}>Sửa</button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vợ / Chồng</span>
                      <button className="text-blue-600 text-sm font-medium hover:underline" onClick={() => alert('Đang mở form thêm vợ/chồng...')}>+ Thêm Vợ/Chồng</button>
                    </div>
                    <p className="text-sm text-slate-500 italic">Chưa có thông tin</p>
                  </div>

                  <button 
                    className="w-full py-3 border-2 border-dashed border-blue-200 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition"
                    onClick={() => alert('Đang mở form thêm con cái...')}
                  >
                    + Thêm Con cái
                  </button>
                  
                  <button 
                    className="w-full py-3 bg-slate-800 text-white font-medium rounded-xl mt-4 hover:bg-slate-700 transition transform hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => window.location.href='/clan-admin/genealogy-tree'}
                  >
                    Xem vị trí trên Cây Gia phả
                  </button>
                </div>
              )}

              {detailTab === 'account' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa liên kết Tài khoản</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-6">Cấp tài khoản đăng nhập cho nhân khẩu này để họ có thể xem gia phả và nhận thông báo sự kiện.</p>
                  
                  <button className="btn-primary" onClick={() => alert('Đã tạo tài khoản cho thành viên này!')}>Tạo Account (Sinh user/pass tự động)</button>
                </div>
              )}
              
              {detailTab === 'history' && (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-600 text-slate-50 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <svg className="fill-current" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900">Thêm mới nhân khẩu</div>
                        <time className="text-xs font-medium text-blue-600">11/09/2026</time>
                      </div>
                      <div className="text-sm text-slate-500">Tạo bởi: Admin Trưởng tộc</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonsPage;
