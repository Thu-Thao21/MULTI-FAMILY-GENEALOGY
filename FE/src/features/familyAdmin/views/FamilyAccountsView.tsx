import React from 'react';
import { EmptyState } from '../../../shared/Feedback/EmptyState';
import { LoadingState } from '../../../shared/Feedback/LoadingState';
import type { ClanUserItem } from '../../../services/admin.service';

export interface ConfirmAccountAction {
  type: 'assign' | 'revoke' | 'expel';
  userId: string;
  userName: string;
}

interface FamilyAccountsViewProps {
  clanUsers: ClanUserItem[];
  loadingUsers: boolean;
  isLeader: boolean;
  actionUserId: string | null;
  confirmAction: ConfirmAccountAction | null;
  setConfirmAction: (action: ConfirmAccountAction | null) => void;
  onRefresh: () => void;
  onExecuteConfirmAction: () => void;
}

export const FamilyAccountsView: React.FC<FamilyAccountsViewProps> = ({
  clanUsers,
  loadingUsers,
  isLeader,
  actionUserId,
  confirmAction,
  setConfirmAction,
  onRefresh,
  onExecuteConfirmAction,
}) => {
  return (
    <>
      <div className="fa-panel">
        <div className="fa-panel-heading">
          <div>
            <h2>Phân quyền Quản trị viên dòng họ (Family Admin)</h2>
            <p>Trưởng tộc bổ nhiệm và phân quyền Family Admin từ các thành viên thuộc dòng họ.</p>
          </div>
          <button type="button" onClick={onRefresh} disabled={loadingUsers}>
            {loadingUsers ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        <div className="fa-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {clanUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '16px' }}>
                    {loadingUsers ? (
                      <LoadingState compact message="Đang truy xuất danh sách tài khoản gia tộc..." />
                    ) : (
                      <EmptyState
                        variant="members"
                        compact
                        title="Chưa có tài khoản thành viên nào"
                        subMessage="Các tài khoản đã được liên kết với hồ sơ dòng họ sẽ xuất hiện tại đây."
                      />
                    )}
                  </td>
                </tr>
              ) : (
                clanUsers.map((u) => {
                  const isOwner = u.roles.includes('BUSINESS_OWNER') || u.roles.includes('owner');
                  return (
                    <tr key={u.user_id}>
                      <td><strong>{u.display_name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        {isOwner ? (
                          <span className="fa-status approved">Trưởng tộc</span>
                        ) : u.is_family_admin ? (
                          <span className="fa-status approved" style={{ background: '#dcfce7', color: '#15803d' }}>
                            Family Admin
                          </span>
                        ) : (
                          <span className="fa-status pending">Thành viên</span>
                        )}
                      </td>
                      <td>
                        <span className={`fa-status ${u.user_status === 'ACTIVE' ? 'approved' : 'rejected'}`}>
                          {u.user_status === 'ACTIVE' ? 'Hoạt động' : u.user_status}
                        </span>
                      </td>
                      <td>
                        <div className="fa-actions" style={{ flexWrap: 'nowrap', gap: '8px' }}>
                          {isOwner ? (
                            <small style={{ color: '#64748b', whiteSpace: 'nowrap' }}>Chủ sở hữu</small>
                          ) : (
                            <>
                              {u.is_family_admin ? (
                                <button
                                  type="button"
                                  style={{
                                    background: '#fee2e2',
                                    color: '#b91c1c',
                                    border: '1px solid #f87171',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                  }}
                                  disabled={!isLeader || actionUserId === u.user_id}
                                  onClick={() => setConfirmAction({ type: 'revoke', userId: u.user_id, userName: u.display_name })}
                                >
                                  {actionUserId === u.user_id ? 'Đang xử lý...' : 'Thu hồi FA'}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="fa-primary"
                                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                                  disabled={!isLeader || actionUserId === u.user_id}
                                  onClick={() => setConfirmAction({ type: 'assign', userId: u.user_id, userName: u.display_name })}
                                >
                                  {actionUserId === u.user_id ? 'Đang xử lý...' : 'Nâng quyền FA'}
                                </button>
                              )}
                              <button
                                type="button"
                                style={{
                                  background: '#fff1f2',
                                  color: '#be123c',
                                  border: '1px solid #fda4af',
                                  height: '38px',
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  cursor: isLeader ? 'pointer' : 'not-allowed',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0,
                                }}
                                disabled={!isLeader || actionUserId === u.user_id}
                                title="Khai trừ thành viên ra khỏi dòng họ"
                                onClick={() => setConfirmAction({ type: 'expel', userId: u.user_id, userName: u.display_name })}
                              >
                                Khai trừ khỏi tộc
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận bổ nhiệm / thu hồi / khai trừ */}
      {confirmAction && (
        <div className="fa-modal-backdrop" onClick={() => !actionUserId && setConfirmAction(null)}>
          <div className="fa-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="fa-modal-title">
              <h2>
                {confirmAction.type === 'assign'
                  ? 'Bổ nhiệm Quản trị viên'
                  : confirmAction.type === 'revoke'
                  ? 'Thu hồi quyền Quản trị viên'
                  : 'Khai trừ thành viên khỏi dòng họ'}
              </h2>
              <button type="button" onClick={() => !actionUserId && setConfirmAction(null)}>×</button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {confirmAction.type === 'assign' && (
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                  Bạn có chắc chắn muốn nâng quyền Quản trị viên dòng họ (Family Admin) cho thành viên <strong>{confirmAction.userName}</strong> không?
                </p>
              )}
              {confirmAction.type === 'revoke' && (
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                  Bạn có chắc chắn muốn thu hồi quyền Family Admin của thành viên <strong>{confirmAction.userName}</strong> không?
                </p>
              )}
              {confirmAction.type === 'expel' && (
                <div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.6 }}>
                    Bạn có chắc chắn muốn khai trừ tài khoản của thành viên <strong>{confirmAction.userName}</strong> ra khỏi dòng họ không?
                  </p>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '12px', color: '#991b1b', fontSize: '13px' }}>
                    <strong>Quy tắc hệ thống:</strong>
                    <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', lineHeight: 1.5 }}>
                      <li>Tài khoản sẽ bị hủy tư cách thành viên và không thể truy cập vào dữ liệu nội bộ dòng họ nữa.</li>
                      <li>Nếu người này đã có hồ sơ trên Cây gia phả, hồ sơ nhân vật và các quan hệ phả hệ vẫn được giữ nguyên vẹn (chỉ hủy liên kết tài khoản).</li>
                      <li>Giải phóng 1 vị trí tham gia dòng họ cho người dùng này.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="fa-modal-actions">
              <button type="button" disabled={!!actionUserId} onClick={() => setConfirmAction(null)}>Hủy bỏ</button>
              <button
                type="button"
                className="fa-primary"
                style={confirmAction.type === 'expel' ? { background: '#dc2626', borderColor: '#b91c1c' } : undefined}
                disabled={!!actionUserId}
                onClick={onExecuteConfirmAction}
              >
                {actionUserId ? 'Đang xử lý...' : confirmAction.type === 'expel' ? 'Xác nhận khai trừ' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
