import React, { useState, useEffect } from 'react';
import { TopBar } from '../../components/dashboard/TopBar';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { PersonalizedOverview } from '../../components/dashboard/PersonalizedOverview';
import { UpcomingEventsWidget } from '../../components/dashboard/UpcomingEventsWidget';
import { RecentActivitiesWidget } from '../../components/dashboard/RecentActivitiesWidget';
import { MemberList } from '../../components/profile/MemberList';
import { ProfileLayout } from '../../components/profile/ProfileLayout';
import { NotificationModal } from '../../components/common/NotificationModal';
import { FamilyPaternalTab } from '../../components/network/FamilyPaternalTab';
import { FamilyMaternalTab } from '../../components/network/FamilyMaternalTab';
import { InLawMarriagesTab } from '../../components/network/InLawMarriagesTab';
import { AffiliatedFamiliesTab } from '../../components/network/AffiliatedFamiliesTab';
import { TreeLayout } from '../../components/tree/TreeLayout';
import RoleRequestModal from '../../components/roleRequest/RoleRequestModal';
import { MemberDashboard, FamilyHeadDashboard, AdminDashboard } from '../../components/roles';
import { getAdminRoleRequests, reviewRoleRequest, type RoleRequestItem } from '../../services/roleRequest.service';
import { useAuth } from '../../hooks/useAuth';
import type { TreeViewMode } from '../../types/tree';
import './Dashboard.css';

export interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName, onLogout }) => {
  const { account, firebaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isProcessingToastOpen, setIsProcessingToastOpen] = useState(false);
  const [toastIcon, setToastIcon] = useState('🌳');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Admin Role Requests State
  const [adminRequests, setAdminRequests] = useState<RoleRequestItem[]>([]);
  const [adminReqLoading, setAdminReqLoading] = useState(false);
  const [reqFilter, setReqFilter] = useState('pending');
  const [actionNotes, setActionNotes] = useState<{ [key: string]: string }>({});
  const [adminMsg, setAdminMsg] = useState('');

  const displayUserName = account?.display_name || account?.username || firebaseUser?.displayName || userName || 'Người dùng';
  const primaryRole = account?.primary_role || 'member';
  const userRole =
    primaryRole === 'admin'
      ? 'Admin'
      : primaryRole === 'family_head'
      ? 'Trưởng họ'
      : 'Thành viên';

  const fetchRoleRequests = async () => {
    if (primaryRole !== 'admin') return;
    setAdminReqLoading(true);
    try {
      const data = await getAdminRoleRequests(reqFilter || undefined);
      setAdminRequests(data);
    } catch (err: any) {
      console.warn('Load role requests failed:', err);
    } finally {
      setAdminReqLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin-role-requests') {
      fetchRoleRequests();
    }
  }, [activeTab, reqFilter]);

  const handleReviewRequest = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await reviewRoleRequest(id, { status, reviewer_notes: actionNotes[id] || '' });
      setAdminMsg(`Đã ${status === 'approved' ? 'phê duyệt' : 'từ chối'} yêu cầu thành công.`);
      fetchRoleRequests();
    } catch (err: any) {
      setAdminMsg(`Lỗi: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'member-list') {
      setSelectedMemberId(null);
    } else if (tabId === 'member-profile') {
      setSelectedMemberId(selectedMemberId);
    } else if (
      tabId === 'net-noi' ||
      tabId === 'net-ngoai' ||
      tabId === 'net-dau-re' ||
      tabId === 'net-thong-gia' ||
      tabId.startsWith('tree') ||
      tabId === 'admin-role-requests'
    ) {
      // Direct component rendering tabs
    } else if (tabId.startsWith('finder')) {
      setToastIcon('🔍');
      setIsProcessingToastOpen(true);
    } else if (tabId.startsWith('admin') || tabId.startsWith('export') || tabId.startsWith('import')) {
      setToastIcon('⚙️');
      setIsProcessingToastOpen(true);
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('member-profile');
  };

  const renderMainContent = () => {
    // Admin Role Request Approval View
    if (activeTab === 'admin-role-requests') {
      return (
        <div className="dashboard-section">
          <div className="section-header">
            <h3>⭐ Phê Duyệt Yêu Cầu Quyền Trưởng Họ</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${reqFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setReqFilter('pending')}
              >
                Chờ duyệt
              </button>
              <button
                className={`filter-btn ${reqFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setReqFilter('approved')}
              >
                Đã duyệt
              </button>
              <button
                className={`filter-btn ${reqFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setReqFilter('rejected')}
              >
                Từ chối
              </button>
              <button
                className={`filter-btn ${reqFilter === '' ? 'active' : ''}`}
                onClick={() => setReqFilter('')}
              >
                Tất cả
              </button>
            </div>
          </div>

          {adminMsg ? <div className="dashboard-alert">{adminMsg}</div> : null}

          {adminReqLoading ? (
            <p className="loading-text">Đang tải danh sách yêu cầu...</p>
          ) : adminRequests.length === 0 ? (
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
                  {adminRequests.map((item) => (
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
                              onClick={() => handleReviewRequest(item.id, 'approved')}
                              className="btn-approve"
                            >
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => handleReviewRequest(item.id, 'rejected')}
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
        </div>
      );
    }

    // Module 1: Cây gia phả trực hệ (ERGO-Centric Tree)
    if (activeTab.startsWith('tree')) {
      const mode: TreeViewMode =
        activeTab === 'tree-horizontal'
          ? 'horizontal'
          : activeTab === 'tree-focus'
          ? 'focus'
          : 'vertical';
      return (
        <TreeLayout
          initialMode={mode}
          onSelectMemberProfile={(memberId) => {
            setSelectedMemberId(memberId);
            setActiveTab('member-profile');
          }}
        />
      );
    }

    // Module 2: Hồ sơ & Thành viên
    if (activeTab === 'member-list' && !selectedMemberId) {
      return <MemberList onSelectMember={handleSelectMember} />;
    }
    if (activeTab === 'member-profile' || selectedMemberId) {
      if (!selectedMemberId) {
        return (
          <div className="dashboard-empty-select-prompt">
            Vui lòng chọn một thành viên từ danh sách để xem hồ sơ chi tiết.
          </div>
        );
      }
      return (
        <ProfileLayout
          memberId={selectedMemberId}
          onBack={() => {
            setSelectedMemberId(null);
            setActiveTab('member-list');
          }}
        />
      );
    }

    // Module 3: Mạng lưới Liên họ
    if (activeTab === 'net-noi') return <FamilyPaternalTab />;
    if (activeTab === 'net-ngoai') return <FamilyMaternalTab />;
    if (activeTab === 'net-dau-re') return <InLawMarriagesTab />;
    if (activeTab === 'net-thong-gia') return <AffiliatedFamiliesTab />;

    // Dashboard (default)
    if (primaryRole === 'admin') {
      return (
        <AdminDashboard
          userName={displayUserName}
          onNavigateTab={handleSelectTab}
        />
      );
    }

    if (primaryRole === 'family_head') {
      return (
        <FamilyHeadDashboard
          userName={displayUserName}
          onNavigateTab={handleSelectTab}
        />
      );
    }

    // Default Member Dashboard
    return (
      <MemberDashboard
        userName={displayUserName}
        userRole={userRole}
        onRequestRole={() => setIsRoleModalOpen(true)}
      />
    );
  };

  return (
    <div className="dashboard-page-container">
      <TopBar
        userName={displayUserName}
        userRole={userRole}
        onLogout={onLogout}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="dashboard-body-row">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
          userRole={userRole}
        />

        <main
          className={`dashboard-main-content ${
            isSidebarCollapsed ? 'collapsed-sidebar' : 'expanded-sidebar'
          }`}
        >
          {renderMainContent()}
        </main>
      </div>

      <footer className="dashboard-footer">
        <div className="dashboard-footer-inner">
          <strong className="dashboard-footer-brand">MULTI-FAMILY GENEALOGY SYSTEM</strong> © 2026 •
          Số hóa & Gắn kết các dòng họ Việt Nam.
        </div>
      </footer>

      <NotificationModal
        isOpen={isProcessingToastOpen}
        onClose={() => setIsProcessingToastOpen(false)}
        icon={toastIcon}
      />

      <RoleRequestModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Dashboard;
