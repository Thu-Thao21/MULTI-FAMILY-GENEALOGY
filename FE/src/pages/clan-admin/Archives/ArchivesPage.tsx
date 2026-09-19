import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface ArchiveFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'doc';
  size: string;
  uploadDate: string;
  uploader: string;
}

export const ArchivesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null);
  
  const data: ArchiveFile[] = [
    { id: '1', name: 'Gia_pha_goc_ban_chu_Han.pdf', type: 'pdf', size: '2.5 MB', uploadDate: '01/09/2026', uploader: 'Nguyễn Văn Admin' },
    { id: '2', name: 'Video_hop_ho_2025.mp4', type: 'video', size: '450 MB', uploadDate: '15/01/2026', uploader: 'Trần Thị Quản Lý' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'doc': return '📝';
      default: return '📁';
    }
  };

  const columns: Column<ArchiveFile>[] = [
    { key: 'name', header: 'Tên file', render: (item) => (
      <div className="flex items-center gap-2">
        <span>{getTypeIcon(item.type)}</span>
        <strong className="text-blue-600 hover:underline cursor-pointer">{item.name}</strong>
      </div>
    )},
    { key: 'size', header: 'Dung lượng', render: (item) => item.size },
    { key: 'uploadDate', header: 'Ngày tải lên', render: (item) => item.uploadDate },
    { key: 'uploader', header: 'Người tải lên', render: (item) => item.uploader },
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <div className="flex gap-2">
        <button 
          className="text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 bg-purple-50 rounded"
          onClick={() => setSelectedFile(item)}
        >
          Phân quyền
        </button>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1">Tải xuống</button>
        <button className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1">Xoá</button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="btn-primary">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
      Tải lên tài liệu
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative">
      <PageHeader 
        title="Kho Tư liệu số" 
        subtitle="Lưu trữ hình ảnh, video, giấy tờ gia phả bản scan, bảo mật an toàn trên Cloud."
        actions={headerActions}
      />
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm tài liệu..." 
          className="form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả định dạng</option>
          <option value="pdf">PDF</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} emptyMessage="Chưa có tài liệu nào trong kho." />
      </div>

      {/* Access Control Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedFile(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(selectedFile.type)}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 line-clamp-1" title={selectedFile.name}>{selectedFile.name}</h2>
                  <p className="text-sm text-slate-500">{selectedFile.size} • Uploaded by {selectedFile.uploader}</p>
                </div>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300" 
                onClick={() => setSelectedFile(null)}
              >✕</button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              <h3 className="font-bold text-slate-800 mb-4">Cấu hình Quyền xem tài liệu</h3>
              
              <div className="space-y-4">
                <label className="flex gap-3 p-4 border border-blue-500 bg-blue-50 rounded-xl cursor-pointer">
                  <input type="radio" name="accessLevel" className="mt-1" defaultChecked />
                  <div>
                    <h4 className="font-bold text-slate-800">Công khai toàn dòng họ</h4>
                    <p className="text-sm text-slate-600">Tất cả thành viên có tài khoản đều có thể xem và tải xuống.</p>
                  </div>
                </label>

                <label className="flex gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="accessLevel" className="mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800">Chỉ Family Admin</h4>
                    <p className="text-sm text-slate-600">Chỉ có Admin Trưởng tộc và các Family Admin mới có thể truy cập.</p>
                  </div>
                </label>

                <label className="flex gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="accessLevel" className="mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800">Riêng tư (Chỉ Trưởng tộc)</h4>
                    <p className="text-sm text-slate-600">Tài liệu bảo mật, chỉ có bạn mới xem được.</p>
                  </div>
                </label>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-slate-800 mb-4">Hoặc Chọn cụ thể Chi/Nhánh:</h3>
                <select className="form-input-admin w-full">
                  <option value="">Chọn Chi/Nhánh được phép xem...</option>
                  <option value="chi1">Chi Trưởng</option>
                  <option value="chi2">Chi Thứ Nhất</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Tính năng này ghi đè lên cấu hình quyền xem phía trên.</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-white">
              <button className="btn-secondary" onClick={() => setSelectedFile(null)}>Hủy bỏ</button>
              <button className="btn-primary" onClick={() => {
                alert('Đã lưu cấu hình phân quyền tài liệu');
                setSelectedFile(null);
              }}>Lưu cấu hình</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivesPage;
