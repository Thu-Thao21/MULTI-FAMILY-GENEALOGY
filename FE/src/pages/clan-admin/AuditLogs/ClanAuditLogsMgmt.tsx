import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';
import DataTable, { type Column } from '../../../components/shared/DataTable/DataTable';

export interface AuditLogItem {
  id: string;
  actor_name: string;
  action: string;
  target_table: string;
  target_id: string;
  ip_address: string;
  created_at: string;
  details?: string;
}

export const ClanAuditLogsMgmt: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const logs: AuditLogItem[] = [
    { id: 'AL-10024', actor_name: 'Nguyễn Văn A (Admin)', action: 'UPDATE', target_table: 'members', target_id: 'MEM-0012', ip_address: '113.190.12.34', created_at: '10/09/2026 14:32:05', details: '{"old": {"status": "alive"}, "new": {"status": "deceased"}}' },
    { id: 'AL-10023', actor_name: 'Hệ thống (Cron)', action: 'BACKUP', target_table: 'database', target_id: 'DB-FULL', ip_address: '127.0.0.1', created_at: '10/09/2026 02:00:00', details: '{"type": "auto_full", "size": "15.2MB"}' },
    { id: 'AL-10022', actor_name: 'Trần Thị B', action: 'CREATE', target_table: 'funds_transactions', target_id: 'TRX-9892', ip_address: '118.69.25.10', created_at: '09/09/2026 09:15:22', details: '{"amount": 500000, "fund_id": 1, "type": "in"}' },
    { id: 'AL-10021', actor_name: 'Nguyễn Văn A (Admin)', action: 'DELETE', target_table: 'library_3d', target_id: 'LIB-005', ip_address: '113.190.12.34', created_at: '08/09/2026 16:45:10', details: '{"deleted_file": "old_model.obj"}' },
  ];

  const filteredLogs = logs.filter(
    (l) =>
      l.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target_table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<AuditLogItem>[] = [
    { key: 'id', header: 'Mã Nhật Ký', render: (item) => <code className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">{item.id}</code> },
    { key: 'actor_name', header: 'Tài khoản thực hiện', render: (item) => <span className="font-medium text-slate-800">{item.actor_name}</span> },
    { key: 'action', header: 'Hành động', render: (item) => (
      <span className={`px-2 py-1 text-xs font-bold rounded ${item.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : item.action === 'CREATE' ? 'bg-green-100 text-green-700' : item.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
        {item.action}
      </span>
    )},
    { key: 'target_table', header: 'Bảng / Đối tượng', render: (item) => (
      <div>
        <div className="font-medium">{item.target_table}</div>
        <div className="text-xs text-slate-500">ID: {item.target_id}</div>
      </div>
    )},
    { key: 'ip_address', header: 'Địa chỉ IP', render: (item) => <span className="text-sm text-slate-500">{item.ip_address}</span> },
    { key: 'created_at', header: 'Thời gian', render: (item) => <span className="text-sm text-slate-500">{item.created_at}</span> },
    { key: 'actions', header: 'Thao tác', render: (item) => (
      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1 rounded" onClick={() => setSelectedLog(item)}>
        Chi tiết
      </button>
    )},
  ];

  const headerActions = (
    <div className="flex gap-2">
      <button className="btn-secondary">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        Xuất file CSV
      </button>
      <button className="btn-primary bg-red-600 hover:bg-red-700 border-red-600">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        Cảnh báo bảo mật (0)
      </button>
    </div>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Nhật Ký Hệ Thống & Audit Logs Bảo Mật" 
        subtitle="Giám sát toàn bộ lịch sử chỉnh sửa, thao tác đăng nhập, phân quyền và bảo vệ dữ liệu nhạy cảm."
        actions={headerActions}
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Tìm theo thao tác, tài khoản, bảng..." 
          className="form-input-admin flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-input-admin w-48">
          <option value="">Tất cả hành động</option>
          <option value="CREATE">CREATE (Thêm)</option>
          <option value="UPDATE">UPDATE (Sửa)</option>
          <option value="DELETE">DELETE (Xoá)</option>
        </select>
        <select className="form-input-admin w-48">
          <option value="">Hôm nay</option>
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <DataTable columns={columns} data={filteredLogs} keyExtractor={(item) => item.id} />
      </div>

      {/* JSON Viewer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Chi tiết Audit Log</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedLog.id}</p>
              </div>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Thời gian</div>
                    <div className="font-medium text-slate-800">{selectedLog.created_at}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">IP Address</div>
                    <div className="font-medium text-slate-800">{selectedLog.ip_address}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tài khoản</div>
                    <div className="font-medium text-slate-800">{selectedLog.actor_name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hành động</div>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${selectedLog.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : selectedLog.action === 'CREATE' ? 'bg-green-100 text-green-700' : selectedLog.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bảng dữ liệu</div>
                    <div className="font-medium text-slate-800">{selectedLog.target_table}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ID Bản ghi</div>
                    <div className="font-medium text-slate-800">{selectedLog.target_id}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dữ liệu thay đổi (JSON Payload)</div>
                  <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                    <pre className="text-green-400 text-sm font-mono leading-relaxed">
                      {selectedLog.details ? JSON.stringify(JSON.parse(selectedLog.details), null, 2) : 'No payload details available.'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button className="btn-secondary w-full" onClick={() => setSelectedLog(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClanAuditLogsMgmt;
