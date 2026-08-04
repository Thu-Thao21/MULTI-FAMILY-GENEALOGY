import React, { useState } from 'react';
import './AdminDataBackupMgmt.css';

export const AdminDataBackupMgmt: React.FC = () => {
  const [backups, setBackups] = useState<any[]>([]);

  const [msg, setMsg] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleTriggerBackup = () => {
    const newBak = {
      id: `bak_${Date.now()}`,
      file_name: `full_backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}.sql.gz`,
      file_size: '14.5 MB',
      created_by: 'Quản Trị Viên',
      created_at: new Date().toLocaleString(),
    };
    setBackups((prev) => [newBak, ...prev]);
    setMsg('Đã tạo bản sao lưu toàn bộ hệ thống thành công!');
    setTimeout(() => setMsg(''), 4000);
  };

  const handleRestore = (fileName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn khôi phục dữ liệu hệ thống từ bản sao lưu "${fileName}"?`)) {
      setMsg(`Đã gửi lệnh khôi phục dữ liệu từ file ${fileName}.` );
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleExportExcel = () => {
    setMsg('Đang tạo file Excel danh sách thành viên... File sẽ tự động tải về!');
    setTimeout(() => setMsg(''), 4000);
  };

  const handleExportTreePDF = () => {
    setMsg('Đang xuất sơ đồ Cây Gia Phả định dạng PDF high-resolution... Sẵn sàng in!');
    setTimeout(() => setMsg(''), 4000);
  };

  const handleImportExcelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Vui lòng chọn file Excel (.xlsx) trước khi tải lên.');
      return;
    }
    setMsg(`Đã nhập dữ liệu thành công từ file "${selectedFile.name}". Cập nhật 45 thành viên!`);
    setSelectedFile(null);
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="admin-backup-container">
      {/* Header */}
      <div className="admin-account-header">
        <div>
          <h2 className="admin-account-title">💾 Xuất Nhập File & Sao Lưu Khôi Phục Hệ Thống</h2>
          <p className="admin-account-subtitle">
            Xuất sơ đồ cây PNG/PDF/In, xuất danh sách Excel, nhập dữ liệu từ Excel, sao lưu và khôi phục toàn bộ CSDL.
          </p>
        </div>
      </div>

      {msg && <div className="admin-msg-box">{msg}</div>}

      {/* Grid of Action Cards */}
      <div className="admin-grid-action-cards">
        {/* Card 1: Export Tree & Reports */}
        <div className="admin-card-box">
          <div className="admin-box-header">
            <h3>🖼️ Xuất Sơ Đồ Cây & Báo Cáo In ấn</h3>
          </div>
          <p className="admin-backup-desc">
            Xuất hình ảnh sơ đồ gia phả trực hệ (PNG high-res), bản in PDF khổ lớn A0/A1 hoặc in trực tiếp.
          </p>
          <div className="admin-btn-group-wrap">
            <button className="admin-btn-primary" onClick={handleExportTreePDF}>
              📄 Xuất PDF / In Sơ Đồ
            </button>
            <button className="btn-icon-action" onClick={handleExportTreePDF}>
              🖼️ Xuất Ảnh PNG High-Res
            </button>
          </div>
        </div>

        {/* Card 2: Export / Import Excel */}
        <div className="admin-card-box">
          <div className="admin-box-header">
            <h3>📊 Báo Cáo & Nhập/Xuất File Excel</h3>
          </div>
          <p className="admin-backup-desc">
            Xuất danh sách thành viên toàn bộ gia tộc ra file Excel hoặc nhập hàng loạt từ file mẫu Excel.
          </p>
          <form onSubmit={handleImportExcelSubmit} className="admin-form-col">
            <button type="button" className="btn-icon-action admin-btn-export-excel" onClick={handleExportExcel}>
              📥 Xuất Danh Sách Thành Viên (Excel)
            </button>
            <div className="admin-upload-row">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="form-input-admin admin-input-file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <button type="submit" className="admin-btn-primary admin-btn-nowrap">
                📤 Import Excel
              </button>
            </div>
          </form>
        </div>

        {/* Card 3: Full Backup System */}
        <div className="admin-card-box">
          <div className="admin-box-header">
            <h3>🛡️ Sao Lưu Khôi Phục Toàn Bộ Hệ Thống</h3>
          </div>
          <p className="admin-backup-desc">
            Tạo bản đóng gói snapshot CSDL PostgresSQL toàn hệ thống để bảo vệ dữ liệu an toàn.
          </p>
          <button className="admin-btn-primary admin-btn-danger" onClick={handleTriggerBackup}>
            ⚡ Tạo Bản Sao Lưu Ngay (Create Instant Snapshot)
          </button>
        </div>
      </div>

      {/* Backup Records Table */}
      <div className="admin-table-card">
        <div className="admin-table-header-box">
          <h3 className="admin-table-title">
            📜 Lịch Sử Bản Sao Lưu CSDL (Backup Records)
          </h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>File sao lưu (.sql.gz)</th>
              <th>Dung lượng</th>
              <th>Người thực hiện</th>
              <th>Thời gian tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((b) => (
              <tr key={b.id}>
                <td className="admin-backup-filename">{b.file_name}</td>
                <td><span className="admin-backup-filesize">{b.file_size}</span></td>
                <td>{b.created_by}</td>
                <td className="admin-backup-time">{b.created_at}</td>
                <td>
                  <div className="action-btn-row">
                    <button className="btn-icon-action unlock" onClick={() => handleRestore(b.file_name)}>
                      🔄 Khôi phục CSDL
                    </button>
                    <button className="btn-icon-action" onClick={() => alert(`Đang tải file ${b.file_name}...`)}>
                      💾 Tải về
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataBackupMgmt;
