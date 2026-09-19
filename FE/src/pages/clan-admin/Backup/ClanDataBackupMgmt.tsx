import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

interface BackupRecord {
  id: string;
  fileName: string;
  size: string;
  type: 'full' | 'partial' | 'auto';
  status: 'success' | 'failed' | 'in_progress';
  date: string;
  createdBy: string;
}

export const ClanDataBackupMgmt: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const [data, setData] = useState<BackupRecord[]>([
    { id: '1', fileName: 'backup_auto_20260910.zip', size: '15.2 MB', type: 'auto', status: 'success', date: '10/09/2026 02:00', createdBy: 'Hệ thống' },
    { id: '2', fileName: 'backup_full_20260901.zip', size: '45.8 MB', type: 'full', status: 'success', date: '01/09/2026 15:30', createdBy: 'Admin' },
    { id: '3', fileName: 'backup_partial_20260815.zip', size: '5.1 MB', type: 'partial', status: 'success', date: '15/08/2026 09:15', createdBy: 'Admin' },
  ]);

  const handleStartBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Mock progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBackingUp(false);
            const newBackup: BackupRecord = {
              id: Date.now().toString(),
              fileName: `backup_manual_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.zip`,
              size: '46.1 MB',
              type: 'full',
              status: 'success',
              date: new Date().toLocaleString('vi-VN'),
              createdBy: 'Quản trị viên'
            };
            setData([newBackup, ...data]);
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
  };

  const columns: Column<BackupRecord>[] = [
    { key: 'fileName', header: 'Tên File', render: (item) => <strong className="text-slate-800">{item.fileName}</strong> },
    { key: 'size', header: 'Dung lượng', render: (item) => item.size },
    { key: 'type', header: 'Loại sao lưu', render: (item) => {
      const types = { full: 'Toàn bộ', partial: 'Một phần', auto: 'Tự động' };
      return types[item.type];
    }},
    { key: 'date', header: 'Thời gian', render: (item) => item.date },
    { key: 'createdBy', header: 'Người thực hiện', render: (item) => item.createdBy },
    { key: 'status', header: 'Trạng thái', render: (item) => (
      <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'success' ? 'bg-green-100 text-green-700' : item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
        {item.status === 'success' ? 'Thành công' : item.status === 'in_progress' ? 'Đang xử lý' : 'Thất bại'}
      </span>
    )},
    { key: 'actions', header: 'Thao tác', render: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded" title="Tải xuống">⬇️ Tải về</button>
        <button className="text-amber-600 hover:text-amber-800 text-sm font-medium px-3 py-1 bg-amber-50 rounded" title="Khôi phục">🔄 Phục hồi</button>
      </div>
    )},
  ];

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Sao Lưu & Khôi Phục Hệ Thống" 
        subtitle="Bảo vệ an toàn dữ liệu gia phả bằng cách tạo bản sao lưu định kỳ và khôi phục khi cần thiết."
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Tạo Bản Sao Lưu Mới</h3>
            <p className="text-sm text-slate-500 mb-6">Tạo một bản sao lưu toàn bộ cơ sở dữ liệu hiện tại (bao gồm cây gia phả, quỹ, hình ảnh).</p>
            
            {isBackingUp ? (
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                  <span>Đang nén dữ liệu...</span>
                  <span>{backupProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${backupProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <button className="btn-primary px-8" onClick={handleStartBackup}>Sao Lưu Ngay</button>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Thông tin lưu trữ</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-slate-600">Tự động sao lưu</span>
                <span className="font-medium text-green-600 bg-green-50 px-2 py-1 rounded text-sm">Đang bật (Hàng tuần)</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-600">Dung lượng đã dùng</span>
                <span className="font-medium text-slate-800">4.2 GB / 10 GB</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-600">Bản sao lưu gần nhất</span>
                <span className="font-medium text-slate-800">10/09/2026 02:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-600">Tổng số bản sao lưu</span>
                <span className="font-medium text-slate-800">{data.length} bản</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Lịch sử Sao lưu</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Tìm kiếm file..." className="form-input-admin text-sm py-1" />
            </div>
          </div>
          <DataTable columns={columns} data={data} keyExtractor={(item) => item.id} />
        </div>
      </div>
    </div>
  );
};

export default ClanDataBackupMgmt;
