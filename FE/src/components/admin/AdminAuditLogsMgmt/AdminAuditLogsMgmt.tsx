import React, { useState } from 'react';
import './AdminAuditLogsMgmt.css';

export interface AuditLogItem {
  id: string;
  actor_name: string;
  action: string;
  target_table: string;
  target_id: string;
  ip_address?: string;
  created_at: string;
}

export const AdminAuditLogsMgmt: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter(
    (l) =>
      l.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target_table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-audit-container">
      {/* Header */}
      <div className="admin-account-header">
        <div>
          <h2 className="admin-account-title">📜 Nhật Ký Hệ Thống & Audit Logs Bảo Mật</h2>
          <p className="admin-account-subtitle">
            Giám sát toàn bộ lịch sử chỉnh sửa, thao tác đăng nhập, phân quyền và bảo vệ dữ liệu nhạy cảm.
          </p>
        </div>

        <div className="admin-account-controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="🔍 Tìm theo thao tác, tài khoản, bảng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Nhật Ký</th>
              <th>Tài khoản thực hiện (Actor)</th>
              <th>Hành động (Action)</th>
              <th>Bảng mục tiêu (Target)</th>
              <th>Địa chỉ IP</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((l) => (
              <tr key={l.id}>
                <td><code>{l.id}</code></td>
                <td className="admin-audit-actor">{l.actor_name}</td>
                <td>
                  <span className="admin-audit-action">
                    {l.action}
                  </span>
                </td>
                <td className="admin-audit-target">{l.target_table}</td>
                <td className="admin-audit-meta">{l.ip_address || '—'}</td>
                <td className="admin-audit-meta">{l.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogsMgmt;
