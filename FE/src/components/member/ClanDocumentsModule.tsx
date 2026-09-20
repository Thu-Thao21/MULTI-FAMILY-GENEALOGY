import React, { useState } from 'react';
import './ClanDocumentsModule.css';

export interface DocumentItem {
  id: string;
  title: string;
  category: 'gia_pha_co' | 'sac_phong' | 'hinh_anh' | 'video' | 'van_ban';
  year: string;
  relatedMember: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  previewUrl?: string;
  description: string;
}

export const ClanDocumentsModule: React.FC = () => {
  const [documents] = useState<DocumentItem[]>([
    {
      id: 'doc-001',
      title: 'Gia Phả Cổ Tộc Họ Nguyễn (Bản Chữ Nôm 1890)',
      category: 'gia_pha_co',
      year: '1890',
      relatedMember: 'Cụ Khởi Tổ Nguyễn Văn A',
      fileSize: '15.4 MB',
      fileType: 'pdf',
      uploadedBy: 'Quản trị viên Chi 1',
      uploadedAt: '2026-01-15',
      description: 'Bản chụp sắc nét cuốn gia phả gốc bằng chữ Nôm ghi lại 5 thế hệ đầu tiên.',
    },
    {
      id: 'doc-002',
      title: 'Sắc Phong Triều Nguyễn Cho Cụ Thượng Sơ',
      category: 'sac_phong',
      year: '1902',
      relatedMember: 'Cụ Nguyễn Văn B (Đời 2)',
      fileSize: '8.2 MB',
      fileType: 'image/png',
      uploadedBy: 'Hội đồng Gia tộc',
      uploadedAt: '2026-03-20',
      description: 'Văn bản sắc phong của triều đình vua Thành Thái ban tặng cho gia tộc.',
    },
    {
      id: 'doc-003',
      title: 'Video Thước Phim Lễ Giỗ Tổ Năm 2025',
      category: 'video',
      year: '2025',
      relatedMember: 'Toàn thể gia tộc',
      fileSize: '120.0 MB',
      fileType: 'mp4',
      uploadedBy: 'Thành viên Nguyễn Văn C',
      uploadedAt: '2025-10-12',
      description: 'Video toàn bộ nghi lễ cúng tổ và tiệc mừng công tại Từ đường.',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentItem | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('van_ban');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.relatedMember.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.year.includes(searchQuery);

    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Max 50MB check
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('Tệp vượt quá kích thước cho phép (Tối đa 50MB).');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      setUploadError('Vui lòng nhập tiêu đề và chọn tệp tư liệu.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);
          // Reset form
          setUploadTitle('');
          setUploadFile(null);
          setUploadProgress(0);
          alert('Gửi đề xuất tư liệu thành công! Đang chờ Quản trị viên kiểm duyệt.');
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="docs-container">
      <div className="docs-header">
        <div>
          <h2 className="docs-title">Kho Tư Liệu Lịch Sử & Văn Bản Gia Tộc</h2>
          <p className="docs-subtitle">
            Lưu trữ, tra cứu gia phả cổ, sắc phong, văn bản, hình ảnh, video truyền thống dòng họ.
          </p>
        </div>
        <button className="upload-doc-btn" onClick={() => setShowUploadModal(true)}>
          📤 Đề xuất tư liệu mới
        </button>
      </div>

      {/* Controls Bar */}
      <div className="docs-controls-bar">
        <input
          type="text"
          className="docs-search-input"
          placeholder="Search tư liệu theo tên, năm, đối tượng liên quan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="docs-category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">-- Tất cả danh mục --</option>
          <option value="gia_pha_co">📜 Gia phả cổ</option>
          <option value="sac_phong">🏛️ Sắc phong</option>
          <option value="hinh_anh">🖼️ Hình ảnh tư liệu</option>
          <option value="video">🎥 Video thước phim</option>
          <option value="van_ban">📄 Văn bản / Nghị quyết</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="docs-grid">
        {filteredDocs.length === 0 ? (
          <div className="docs-empty">Không tìm thấy tư liệu phù hợp với điều kiện tìm kiếm.</div>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="doc-card">
              <div className="doc-card-head">
                <span className="doc-category-badge">
                  {doc.category === 'gia_pha_co' && '📜 Gia phả cổ'}
                  {doc.category === 'sac_phong' && '🏛️ Sắc phong'}
                  {doc.category === 'video' && '🎥 Video'}
                  {doc.category === 'van_ban' && '📄 Văn bản'}
                </span>
                <span className="doc-year-badge">Năm {doc.year}</span>
              </div>

              <h3 className="doc-item-title">{doc.title}</h3>
              <p className="doc-desc">{doc.description}</p>

              <div className="doc-meta">
                <div>👤 <strong>Liên quan:</strong> {doc.relatedMember}</div>
                <div>📁 <strong>Định dạng:</strong> {doc.fileType.toUpperCase()} ({doc.fileSize})</div>
              </div>

              <div className="doc-actions">
                <button className="preview-doc-btn" onClick={() => setSelectedPreviewDoc(doc)}>
                  👁️ Xem trước
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {selectedPreviewDoc && (
        <div className="preview-modal-overlay">
          <div className="preview-modal-card">
            <div className="preview-modal-header">
              <h3>{selectedPreviewDoc.title}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPreviewDoc(null)}>✕</button>
            </div>
            <div className="preview-modal-body">
              <div className="preview-placeholder">
                📄 [Đang xem nội dung xem trước bản điện tử của {selectedPreviewDoc.title}]
              </div>
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
                {selectedPreviewDoc.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Proposal Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay">
          <div className="upload-modal-card">
            <div className="upload-modal-header">
              <h3>Đề Xuất Đóng Góp Tư Liệu Mới</h3>
              <button className="modal-close-btn" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>

            {uploadError && <div className="upload-error-alert">{uploadError}</div>}

            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="modal-field">
                <label className="modal-label">Tiêu đề tư liệu *</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Nhập tên tài liệu, ảnh, sắc phong..."
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Danh mục tư liệu *</label>
                <select
                  className="modal-select"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                >
                  <option value="gia_pha_co">Gia phả cổ</option>
                  <option value="sac_phong">Sắc phong</option>
                  <option value="hinh_anh">Hình ảnh tư liệu</option>
                  <option value="video">Video thước phim</option>
                  <option value="van_ban">Văn bản / Nghị quyết</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">Chọn tệp tài liệu (Tối đa 50MB) *</label>
                <input
                  type="file"
                  className="modal-file-input"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.mp4,.docx"
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Mô tả chi tiết & Nguồn gốc</label>
                <textarea
                  className="modal-textarea"
                  rows={3}
                  placeholder="Mô tả hoàn cảnh lưu trữ, xuất xứ của tư liệu..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                />
              </div>

              {isUploading && (
                <div className="progress-box">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  <span className="progress-text">Đang tải lên... {uploadProgress}%</span>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                >
                  Hủy
                </button>
                <button type="submit" className="modal-submit-btn" disabled={isUploading}>
                  {isUploading ? 'Đang tải...' : 'Gửi tư liệu duyệt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanDocumentsModule;
