import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface FamilyAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  status: 'active' | 'inactive';
}

export const FamilyAdminsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<FamilyAdmin | null>(null);
  
  // Mock data
  const data: FamilyAdmin[] = [
    { id: '1', name: 'Nguyễn Văn Admin', email: 'admin.nguyen@email.com', phone: '0987654321', branch: 'Chi 1', status: 'active' },
    { id: '2', name: 'Trần Thị Quản Lý', email: 'quanly@email.com', phone: '0123456789', branch: 'Nhánh 1.2', status: 'active' },
  ];

  const columns: Column<FamilyAdmin>[] = [
    { key: 'name', header: 'Họ và tên', render: (item) => <strong className="text-slate-800">{item.name}</strong> },
    { key: 'email', header: 'Email', render: (item) => item.email },
    { key: 'phone', header: 'Số điện thoại', render: (item) => item.phone },
    { key: 'branch', header: 'Quản lý Chi/Nhánh', render: (item) => item.branch },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
        {item.status === 'active' ? 'Đang hoạt động' : 'Đã khoá'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <div className="flex gap-2">
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded"
          onClick={() => setSelectedAdmin(item)}
        >
          Phân quyền
        </button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Cấp quyền Admin mới
    </button>
  );

  const permissionGroups = [
    { id: 'tree', label: 'Cây Gia Phả', desc: 'Sửa chữa cấu trúc, thêm mới quan hệ' },
    { id: 'member', label: 'Nhân khẩu & Tài khoản', desc: 'Thêm, sửa hồ sơ, cấp tài khoản' },
    { id: 'fund', label: 'Quỹ dòng họ', desc: 'Xem số dư, tạo phiếu thu chi' },
    { id: 'event', label: 'Sự kiện & Ngày giỗ', desc: 'Tạo và gửi thông báo nhắc nhở' },
    { id: 'archive', label: 'Kho Tư liệu', desc: 'Tải lên, xóa ảnh và giấy tờ' },
    { id: 'interfamily', label: 'Liên họ', desc: 'Chấp nhận/từ chối yêu cầu kết nối' },
  ];

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Quản lý Family Admin" 
        subtitle="Danh sách các thành viên được cấp quyền quản trị phụ trách Chi / Nhánh."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm tên, email, sđt..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Đã khoá</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={data} 
          keyExtractor={(item) => item.id} 
          emptyMessage="Chưa có Family Admin nào được cấp quyền."
        />
      </div>

      {/* Permission Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAdmin(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                  {selectedAdmin.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedAdmin.name}</h2>
                  <p className="text-sm text-slate-500">Quản lý: <strong>{selectedAdmin.branch}</strong></p>
                </div>
              </div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition"
                onClick={() => setSelectedAdmin(null)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Cấu hình Phân quyền (Permissions)</h3>
              
              <div className="space-y-4 mb-8">
                {permissionGroups.map(group => (
                  <label key={group.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 mt-0.5" defaultChecked={group.id === 'tree' || group.id === 'member'} />
                    <div>
                      <h4 className="font-bold text-slate-800">{group.label}</h4>
                      <p className="text-sm text-slate-500">{group.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-red-600 mb-2">Vùng nguy hiểm</h3>
                <p className="text-sm text-slate-500 mb-4">Hạ quyền quản trị viên này trở thành Member thông thường. Mọi quyền hạn sẽ bị thu hồi.</p>
                <button 
                  className="w-full py-3 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition"
                  onClick={() => {
                    alert('Đã thu hồi quyền Admin');
                    setSelectedAdmin(null);
                  }}
                >
                  Thu hồi quyền Family Admin
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setSelectedAdmin(null)}>Hủy bỏ</button>
              <button className="btn-primary" onClick={() => {
                alert('Đã lưu cấu hình phân quyền');
                setSelectedAdmin(null);
              }}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyAdminsPage;
