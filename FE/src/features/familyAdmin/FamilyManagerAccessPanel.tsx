import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '../../api/axios';
import type { AccountProfile } from '../../context/AuthContext';
import './FamilyManagerAccessPanel.css';

const hasActiveManagerRole = (account: AccountProfile) => account.roles.some(
  (role) => role.role.toLowerCase() === 'manager' && role.status.toLowerCase() === 'active' && Boolean(role.family_id),
);

export const FamilyManagerAccessPanel: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<AccountProfile[]>('/users/family/accounts');
      setAccounts(response.data);
      setNotice(null);
    } catch (error) {
      const message = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setNotice({ text: message || 'Không thể tải danh sách thành viên của dòng họ.', error: true });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  const updateAccess = async (account: AccountProfile) => {
    const enabled = !hasActiveManagerRole(account);
    setUpdatingId(account.id);
    setNotice(null);
    try {
      const response = await apiClient.patch<AccountProfile>(`/users/family/accounts/${account.id}/manager`, { enabled });
      setAccounts((current) => current.map((item) => item.id === account.id ? response.data : item));
      setNotice({
        text: enabled
          ? `Đã trao quyền Family Admin cho ${account.display_name || account.username}.`
          : `Đã thu hồi quyền Family Admin của ${account.display_name || account.username}.`,
        error: false,
      });
    } catch (error) {
      const message = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setNotice({ text: message || 'Không thể cập nhật quyền Family Admin.', error: true });
    } finally {
      setUpdatingId(null);
    }
  };

  return <section className="family-manager-access" aria-labelledby="family-manager-access-title">
    <div className="family-manager-access-heading">
      <div>
        <span>PHÂN QUYỀN THEO DÒNG HỌ</span>
        <h2 id="family-manager-access-title">Trao quyền Family Admin</h2>
        <p>Chỉ Trưởng tộc có thể cấp hoặc thu hồi quyền quản lý. Thành viên chưa được cấp quyền vẫn sử dụng hệ thống như Member thông thường.</p>
      </div>
      <button type="button" onClick={() => void loadAccounts()} disabled={loading}>Tải lại</button>
    </div>

    {notice && <div className={`family-manager-access-notice ${notice.error ? 'error' : 'success'}`} role="status">{notice.text}</div>}

    {loading ? <p className="family-manager-access-state">Đang tải danh sách thành viên...</p> : accounts.length === 0 ? <p className="family-manager-access-state">Chưa có tài khoản Member nào trong dòng họ.</p> : <div className="family-manager-access-table-wrap">
      <table>
        <thead><tr><th>Thành viên</th><th>Email</th><th>Quyền hiện tại</th><th>Thao tác của Trưởng tộc</th></tr></thead>
        <tbody>{accounts.map((account) => {
          const isManager = hasActiveManagerRole(account);
          return <tr key={account.id}>
            <td><strong>{account.display_name || account.username || 'Chưa đặt tên'}</strong><small>@{account.username || account.id}</small></td>
            <td>{account.email || '—'}</td>
            <td><span className={`family-manager-role ${isManager ? 'manager' : 'member'}`}>{isManager ? 'Family Admin' : 'Thành viên'}</span></td>
            <td><button type="button" className={isManager ? 'revoke' : 'grant'} disabled={updatingId === account.id} onClick={() => void updateAccess(account)}>{updatingId === account.id ? 'Đang cập nhật...' : isManager ? 'Thu hồi quyền' : 'Trao quyền Family Admin'}</button></td>
          </tr>;
        })}</tbody>
      </table>
    </div>}
  </section>;
};

export default FamilyManagerAccessPanel;
