import React, { useEffect, useState } from 'react';
import { getAdminRoleRequests, reviewRoleRequest, type RoleRequestItem } from '../../services/roleRequest.service';
import './Dashboard.css';

interface AdminDashboardProps {
  userName: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userName, onLogout }) => {
  const [requests, setRequests] = useState<RoleRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState<{ [key: string]: string }>({});
  const [msg, setMsg] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getAdminRoleRequests(filter || undefined);
      setRequests(data);
    } catch (err: any) {
      console.error('Failed to load role requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleReview = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessingId(id);
    setMsg('');
    try {
      const notes = actionNotes[id] || '';
      await reviewRoleRequest(id, { status: newStatus, reviewer_notes: notes });
      setMsg(`Đã ${newStatus === 'approved' ? 'phê duyệt' : 'từ chối'} yêu cầu thành công.`);
      fetchRequests();
    } catch (err: any) {
      setMsg(`Lỗi: ${err.response?.data?.detail || err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title-area">
          <span className="role-badge admin">👑 QUẢN TRỊ VIÊN (ADMIN)</span>
          <h2>Hệ Thống Phê Duyệt & Quản Lý Gia Phả</h2>
        </div>
        <div className="user-profile-widget">
          <span>Xin chào, <strong>{userName}</strong></span>
          <button onClick={onLogout} className="logout-button">Đăng xuất</button>
        </div>
      </header>

      <main className="dashboard-main">
        {msg ? <div className="dashboard-alert">📢 {msg}</div> : null}

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Yêu cầu chờ duyệt</h3>
            <p className="stat-number">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Trạng thái lọc</h3>
            <p className="stat-status">{filter.toUpperCase()}</p>
          </div>
          <div className="stat-card">
            <h3>Quyền Hạn</h3>
            <p className="stat-role">Toàn quyền Hệ thống</p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h3>Danh Sách Yêu Cầu Nâng Vai Trò (Trưởng Họ)</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Chờ duyệt
              </button>
              <button
                className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                Đã duyệt
              </button>
              <button
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Đã từ chối
              </button>
              <button
                className={`filter-btn ${filter === '' ? 'active' : ''}`}
                onClick={() => setFilter('')}
              >
                Tất cả
              </button>
            </div>
          </div>

          {loading ? (
            <p className="loading-text">Đang tải danh sách yêu cầu...</p>
          ) : requests.length === 0 ? (
            <p className="empty-text">Không có yêu cầu nào trong danh mục này.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã Yêu Cầu</th>
                    <th>Account ID</th>
                    <th>Vai Trò Yêu Cầu</th>
                    <th>Mã Dòng Họ</th>
                    <th>Lý Do</th>
                    <th>Trạng Thái</th>
                    <th>Ghi Chú Admin</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((item) => (
                    <tr key={item.id}>
                      <td><code>{item.id.slice(0, 8)}...</code></td>
                      <td><code>{item.account_id.slice(0, 8)}...</code></td>
                      <td><span className="badge-role">{item.requested_role}</span></td>
                      <td>{item.family_id || 'N/A'}</td>
                      <td>{item.reason || 'Không có'}</td>
                      <td>
                        <span className={`status-pill ${item.status}`}>
                          {item.status === 'pending' ? 'Chờ duyệt' : item.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      <td>
                        {item.status === 'pending' ? (
                          <input
                            type="text"
                            className="notes-input"
                            placeholder="Nhập ghi chú..."
                            value={actionNotes[item.id] || ''}
                            onChange={(e) => setActionNotes({ ...actionNotes, [item.id]: e.target.value })}
                          />
                        ) : (
                          item.reviewer_notes || '—'
                        )}
                      </td>
                      <td>
                        {item.status === 'pending' ? (
                          <div className="action-btn-group">
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleReview(item.id, 'approved')}
                              className="btn-approve"
                            >
                              Phê duyệt
                            </button>
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleReview(item.id, 'rejected')}
                              className="btn-reject"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="completed-label">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
