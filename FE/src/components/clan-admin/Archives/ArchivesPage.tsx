import './ArchivesPage.css';
import React, { useState } from 'react';
import PageHeader from '../../../shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../shared/DataTable/DataTable';

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
      <div className="archive-name-col">
        <span>{getTypeIcon(item.type)}</span>
        <strong className="archive-name-link">{item.name}</strong>
      </div>
    )},
    { key: 'size', header: 'Dung lượng', render: (item) => item.size },
    { key: 'uploadDate', header: 'Ngày tải lên', render: (item) => item.uploadDate },
    { key: 'uploader', header: 'Người tải lên', render: (item) => item.uploader },
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <div className="archive-actions">
        <button 
          className="archive-btn-permission"
          onClick={() => setSelectedFile(item)}
        >
          Phân quyền
        </button>
        <button className="archive-btn-download">Tải xuống</button>
        <button className="archive-btn-delete">Xoá</button>
      </div>
    )},
  ];

  const headerActions = (
    <button className="admin-btn-primary">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
      Tải lên tài liệu
    </button>
  );

  return (
    <div className="admin-account-container">
      
      <div className="admin-account-header">
        <div>
          <h2 className="admin-account-title">Kho Tư liệu số</h2>
          <p className="admin-account-subtitle">Lưu trữ hình ảnh, video, giấy tờ gia phả bản scan, bảo mật an toàn trên Cloud.</p>
        </div>
        <div className="admin-account-controls">
          {headerActions}
        </div>
      </div>
      
      <div className="archive-filter-bar">
        <input 
          type="text" 
          placeholder="Tìm kiếm tài liệu..." 
          className="archive-search-input form-input-admin flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="archive-filter-select form-input-admin w-48">
          <option value="">Tất cả định dạng</option>
          <option value="pdf">PDF</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="archive-table-container">
        <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} emptyMessage="Chưa có tài liệu nào trong kho." />
      </div>

      {/* Access Control Modal */}
      {selectedFile && (
        <div className="archive-modal-overlay">
          <div className="archive-modal-backdrop" onClick={() => setSelectedFile(null)}></div>
          
          <div className="archive-modal-content relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="archive-modal-header">
              <div className="archive-modal-header-left">
                <span className="text-2xl">{getTypeIcon(selectedFile.type)}</span>
                <div>
                  <h2 className="archive-modal-title" title={selectedFile.name}>{selectedFile.name}</h2>
                  <p className="archive-modal-subtitle">{selectedFile.size} • Uploaded by {selectedFile.uploader}</p>
                </div>
              </div>
              <button 
                className="archive-modal-close-btn" 
                onClick={() => setSelectedFile(null)}
              >✕</button>
            </div>

            <div className="archive-modal-body">
              <h3 className="archive-perm-title">Cấu hình Quyền xem tài liệu</h3>
              
              <div className="space-y-4">
                <label className="archive-perm-option-active">
                  <input type="radio" name="accessLevel" className="mt-1" defaultChecked />
                  <div>
                    <h4 className="archive-perm-option-title">Công khai toàn dòng họ</h4>
                    <p className="archive-perm-option-desc">Tất cả thành viên có tài khoản đều có thể xem và tải xuống.</p>
                  </div>
                </label>

                <label className="archive-perm-option">
                  <input type="radio" name="accessLevel" className="mt-1" />
                  <div>
                    <h4 className="archive-perm-option-title">Chỉ Family Admin</h4>
                    <p className="archive-perm-option-desc">Chỉ có Admin Trưởng tộc và các Family Admin mới có thể truy cập.</p>
                  </div>
                </label>

                <label className="archive-perm-option">
                  <input type="radio" name="accessLevel" className="mt-1" />
                  <div>
                    <h4 className="archive-perm-option-title">Riêng tư (Chỉ Trưởng tộc)</h4>
                    <p className="archive-perm-option-desc">Tài liệu bảo mật, chỉ có bạn mới xem được.</p>
                  </div>
                </label>
              </div>

              <div className="mt-8">
                <h3 className="archive-perm-branch-title">Hoặc Chọn cụ thể Chi/Nhánh:</h3>
                <select className="archive-perm-branch-select form-input-admin w-full">
                  <option value="">Chọn Chi/Nhánh được phép xem...</option>
                  <option value="chi1">Chi Trưởng</option>
                  <option value="chi2">Chi Thứ Nhất</option>
                </select>
                <p className="archive-perm-branch-hint">Tính năng này ghi đè lên cấu hình quyền xem phía trên.</p>
              </div>
            </div>

            <div className="archive-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setSelectedFile(null)}>Hủy bỏ</button>
              <button className="admin-btn-primary" onClick={() => {
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
