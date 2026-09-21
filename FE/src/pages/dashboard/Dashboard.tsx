import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar } from '../../components/dashboard/TopBar';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { MemberList } from '../../components/profile/MemberList';
import { ProfileLayout } from '../../components/profile/ProfileLayout';
import { FamilyPaternalTab } from '../../components/network/FamilyPaternalTab';
import { FamilyMaternalTab } from '../../components/network/FamilyMaternalTab';
import { InLawMarriagesTab } from '../../components/network/InLawMarriagesTab';
import { AffiliatedFamiliesTab } from '../../components/network/AffiliatedFamiliesTab';
import { TreeLayout } from '../../components/tree/TreeLayout';
import { MemberDashboard, AdminDashboard } from '../../components/roles';
import { useToast } from '../../components/common/Toast';
import trongDongBg from '../../assets/trong-dong-vector-1.jpg';

import {
  AdminBusinessRequests,
  AdminBusinessesMgmt,
  AdminPlansMgmt,
  AdminPaymentsMgmt,
  AdminAccountMgmt,
  AdminManagerTransfer,
  AdminReportsMgmt,
  AdminAuditLogsMgmt,
  AdminDataBackupMgmt,
  AdminSupportAccess,
  AdminSecurity,
  AdminFamiliesMgmt,
  AdminMembersMgmt,
  AdminFamilyLinksMgmt,
  AdminApprovalsMgmt,
} from '../../components/admin';

import { MyProfile } from '../../components/profile/MyProfile/MyProfile';
import { AccountSettings } from '../../components/settings/AccountSettings/AccountSettings';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/routes';
import type { TreeViewMode } from '../../types/tree';
import './Dashboard.css';

// ===== Tab ID  URL Route Mapping =====
// Maps every sidebar/card tab ID to a URL route from routes.ts
const TAB_TO_ROUTE: Record<string, string> = {
  // User / Member tabs
  'dashboard':            '', // will resolve to /user or /admin root
  'tree':                 ROUTES.USER.TREE_HORIZONTAL,
  'tree-vertical':        ROUTES.USER.TREE_HORIZONTAL,
  'tree-horizontal':      ROUTES.USER.TREE_HORIZONTAL,
  'tree-focus':           ROUTES.USER.TREE_HORIZONTAL,
  'net-noi':              ROUTES.USER.NETWORK_NOI,
  'net-ngoai':            ROUTES.USER.NETWORK_NGOAI,
  'net-dau-re':           ROUTES.USER.NETWORK_DAU_RE,
  'net-thong-gia':        ROUTES.USER.NETWORK_THONG_GIA,
  'member-list':          ROUTES.USER.MEMBERS,
  'member-profile':       ROUTES.USER.MEMBER_PROFILE,
  // Family Head tabs (from MemberDashboard cards)
  'family-management':    ROUTES.USER.FAMILY_MANAGEMENT,
  'family-branches':      ROUTES.USER.FAMILY_BRANCHES,
  'family-approvals':     ROUTES.USER.FAMILY_APPROVALS,
  'family-import-export': ROUTES.USER.FAMILY_IMPORT_EXPORT,
  'family-logs':          ROUTES.USER.FAMILY_LOGS,
  // User Profile & Settings
  'my-profile':          ROUTES.ADMIN.MY_PROFILE,
  'account-settings':    ROUTES.ADMIN.SETTINGS,
  // Admin tabs (Theo Kế hoạch MFGMS AI)
  'admin-business-requests': ROUTES.ADMIN.BUSINESS_REQUESTS,
  'admin-businesses':        ROUTES.ADMIN.BUSINESSES,
  'admin-manager-transfer':  ROUTES.ADMIN.MANAGER_TRANSFER,
  'admin-plans':             ROUTES.ADMIN.PLANS,
  'admin-payments':          ROUTES.ADMIN.PAYMENTS,
  'admin-accounts':          ROUTES.ADMIN.ACCOUNTS,
  'admin-reports':           ROUTES.ADMIN.REPORTS,
  'admin-audit-logs':        ROUTES.ADMIN.AUDIT_LOGS,
  'admin-data-backup':       ROUTES.ADMIN.BACKUP,
  'admin-support-access':    ROUTES.ADMIN.SUPPORT_ACCESS,
  'admin-security':          ROUTES.ADMIN.SECURITY,
  // Admin tabs (Tương thích ngược)
  'admin-permissions':    ROUTES.ADMIN.ACCOUNTS,
  'admin-approval':       ROUTES.ADMIN.BUSINESS_REQUESTS,
  'admin-logs':           ROUTES.ADMIN.AUDIT_LOGS,
  'admin-account-mgmt':   ROUTES.ADMIN.ACCOUNTS,
  'admin-families-mgmt':  ROUTES.ADMIN.BUSINESSES,
  'admin-members-mgmt':   ROUTES.ADMIN.ACCOUNTS,
  'admin-family-links':   ROUTES.ADMIN.BUSINESSES,
  'admin-approvals':      ROUTES.ADMIN.BUSINESS_REQUESTS,
  'admin-security-logs':  ROUTES.ADMIN.AUDIT_LOGS,
};

// Reverse: URL route → tab ID (longest match first)
const ROUTE_TO_TAB: Array<[string, string]> = [
  // Admin routes
  [ROUTES.ADMIN.MY_PROFILE,        'my-profile'],
  [ROUTES.ADMIN.SETTINGS,          'account-settings'],
  [ROUTES.USER.MY_PROFILE,         'my-profile'],
  [ROUTES.USER.SETTINGS,           'account-settings'],
  [ROUTES.ADMIN.BUSINESS_REQUESTS, 'admin-business-requests'],
  [ROUTES.ADMIN.BUSINESSES,        'admin-businesses'],
  [ROUTES.ADMIN.MANAGER_TRANSFER,  'admin-manager-transfer'],
  [ROUTES.ADMIN.PLANS,             'admin-plans'],
  [ROUTES.ADMIN.PAYMENTS,          'admin-payments'],
  [ROUTES.ADMIN.ACCOUNTS,          'admin-accounts'],
  [ROUTES.ADMIN.USERS,             'admin-accounts'],
  [ROUTES.ADMIN.REPORTS,           'admin-reports'],
  [ROUTES.ADMIN.AUDIT_LOGS,        'admin-audit-logs'],
  [ROUTES.ADMIN.SECURITY_LOGS,     'admin-audit-logs'],
  [ROUTES.ADMIN.BACKUP,            'admin-data-backup'],
  [ROUTES.ADMIN.SUPPORT_ACCESS,    'admin-support-access'],
  [ROUTES.ADMIN.SECURITY,          'admin-security'],
  [ROUTES.ADMIN.FAMILIES,          'admin-businesses'],
  [ROUTES.ADMIN.MEMBERS,           'admin-accounts'],
  [ROUTES.ADMIN.FAMILY_LINKS,      'admin-businesses'],
  [ROUTES.ADMIN.APPROVALS,         'admin-business-requests'],
  // User Family Head routes
  [ROUTES.USER.FAMILY_BRANCHES,      'family-branches'],
  [ROUTES.USER.FAMILY_APPROVALS,     'family-approvals'],
  [ROUTES.USER.FAMILY_IMPORT_EXPORT, 'family-import-export'],
  [ROUTES.USER.FAMILY_LOGS,          'family-logs'],
  [ROUTES.USER.FAMILY_MANAGEMENT,    'family-management'],
  // User Tree routes
  [ROUTES.USER.TREE,            'tree'],
  [ROUTES.USER.TREE_VERTICAL,   'tree'],
  [ROUTES.USER.TREE_HORIZONTAL, 'tree'],
  [ROUTES.USER.TREE_FOCUS,      'tree'],
  // User Network routes
  [ROUTES.USER.NETWORK_NOI,      'net-noi'],
  [ROUTES.USER.NETWORK_NGOAI,    'net-ngoai'],
  [ROUTES.USER.NETWORK_DAU_RE,   'net-dau-re'],
  [ROUTES.USER.NETWORK_THONG_GIA,'net-thong-gia'],
  // User Members
  [ROUTES.USER.MEMBER_PROFILE, 'member-profile'],
  [ROUTES.USER.MEMBERS,        'member-list'],
];

export interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName, onLogout }) => {
  const { account, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const toast = useToast();

  const isAdminPath = location.pathname.startsWith('/admin');
  const displayUserName = account?.display_name || account?.username || firebaseUser?.displayName || userName || (isAdminPath ? 'Quản Trị Viên (Demo)' : 'Người Dùng (Demo)');
  const primaryRole = account?.primary_role || (isAdminPath ? 'admin' : 'member');
  const userRole = primaryRole === 'admin' ? 'Admin' : 'Thành viên';

  const basePath = primaryRole === 'admin' ? ROUTES.ADMIN.ROOT : ROUTES.USER.ROOT;

  // ===== Sync URL → activeTab on mount & URL change =====
  useEffect(() => {
    const path = location.pathname;
    for (const [route, tabId] of ROUTE_TO_TAB) {
      if (path === route || path.startsWith(route + '/')) {
        setActiveTab(tabId);
        return;
      }
    }
    // No match → show dashboard
    setActiveTab('dashboard');
  }, [location.pathname]);

  // ===== Navigate to URL when tab is selected =====
  const handleSelectTab = useCallback((tabId: string) => {
    // Set active tab immediately
    setActiveTab(tabId);

    // Navigate to URL if route exists
    if (tabId === 'my-profile') {
      navigate(primaryRole === 'admin' ? ROUTES.ADMIN.MY_PROFILE : ROUTES.USER.MY_PROFILE, { replace: false });
      return;
    }
    if (tabId === 'account-settings') {
      navigate(primaryRole === 'admin' ? ROUTES.ADMIN.SETTINGS : ROUTES.USER.SETTINGS, { replace: false });
      return;
    }

    const route = TAB_TO_ROUTE[tabId];
    if (route) {
      navigate(route, { replace: false });
    } else if (tabId === 'dashboard') {
      navigate(basePath, { replace: false });
    }

    // Handle special behaviors with toast feedback
    if (tabId === 'member-list') {
      setSelectedMemberId(null);
    } else if (tabId === 'member-add') {
      toast.info('Thêm thành viên mới', 'Tính năng đang được phát triển, sẽ sớm ra mắt!');
    } else if (tabId === 'finder-auto') {
      toast.info('Tính quan hệ tự động', 'Tính năng tra cứu xưng hô đang được xây dựng.');
    } else if (tabId === 'finder-path') {
      toast.info('Tìm đường đi quan hệ', 'Chức năng tìm kiếm đường quan hệ sẽ sớm hoàn thiện.');
    } else if (tabId === 'export-pdf') {
      toast.loading('Đang chuẩn bị xuất PDF...', 'Hệ thống đang tạo sơ đồ gia phả dạng PDF.');
    } else if (tabId === 'export-excel') {
      toast.loading('Đang xuất Excel...', 'Vui lòng chờ trong khi dữ liệu được xử lý.');
    } else if (tabId === 'import-data') {
      toast.info('Nhập dữ liệu gia phả', 'Vui lòng chọn file để nhập dữ liệu vào hệ thống.');
    } else if (tabId === 'admin-role-requests') {
      toast.info('Yêu cầu phân quyền', 'Đang tải danh sách yêu cầu cấp quyền...');
    }
  }, [navigate, basePath, toast]);

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('member-profile');
    navigate(ROUTES.USER.MEMBER_PROFILE, { replace: false });
  };

  const renderMainContent = () => {
    // ===== Common: My Profile & Account Settings =====
    if (activeTab === 'my-profile') {
      return (
        <MyProfile
          userName={displayUserName}
          userRole={userRole}
          onBack={() => handleSelectTab('dashboard')}
        />
      );
    }
    if (activeTab === 'account-settings') {
      return (
        <AccountSettings
          userName={displayUserName}
          userRole={userRole}
          onBack={() => handleSelectTab('dashboard')}
        />
      );
    }

    // ===== Branch for System Admin (Theo Kế hoạch MFGMS AI) =====
    if (primaryRole === 'admin') {
      if (activeTab === 'admin-business-requests' || activeTab === 'admin-approval' || activeTab === 'admin-approvals') {
        return <AdminBusinessRequests onNavigateToCreateBusiness={() => handleSelectTab('admin-businesses')} />;
      }
      if (activeTab === 'admin-businesses' || activeTab === 'admin-families-mgmt' || activeTab === 'admin-family-links') {
        return <AdminBusinessesMgmt />;
      }
      if (activeTab === 'admin-manager-transfer') {
        return <AdminManagerTransfer />;
      }
      if (activeTab === 'admin-plans') {
        return <AdminPlansMgmt />;
      }
      if (activeTab === 'admin-payments') {
        return <AdminPaymentsMgmt />;
      }
      if (activeTab === 'admin-accounts' || activeTab === 'admin-permissions' || activeTab === 'admin-account-mgmt' || activeTab === 'admin-members-mgmt') {
        return <AdminAccountMgmt />;
      }
      if (activeTab === 'admin-reports') {
        return <AdminReportsMgmt />;
      }
      if (activeTab === 'admin-audit-logs' || activeTab === 'admin-logs' || activeTab === 'admin-security-logs') {
        return <AdminAuditLogsMgmt />;
      }
      if (activeTab === 'admin-data-backup') {
        return <AdminDataBackupMgmt />;
      }
      if (activeTab === 'admin-support-access') {
        return <AdminSupportAccess />;
      }
      if (activeTab === 'admin-security') {
        return <AdminSecurity />;
      }

      // Default Admin View (M13 KPI Dashboard)
      return (
        <AdminDashboard
          userName={displayUserName}
          onNavigateTab={handleSelectTab}
        />
      );
    }

    // ===== Branch for Member & Family Head =====
    if (activeTab === 'family-management') return <MemberList onSelectMember={handleSelectMember} />;
    if (activeTab === 'family-branches') return <MemberList onSelectMember={handleSelectMember} />;
    if (activeTab === 'family-approvals') return <AdminApprovalsMgmt />;
    if (activeTab === 'family-import-export') return <AdminDataBackupMgmt />;
    if (activeTab === 'family-logs') return <AdminAuditLogsMgmt />;

    // ===== Module: Cây gia phả =====
    if (activeTab.startsWith('tree')) {
      const mode: TreeViewMode =
        activeTab === 'tree-horizontal'
          ? 'horizontal'
          : activeTab === 'tree-focus'
          ? 'focus'
          : 'vertical';
      return (
        <TreeLayout
          onSelectMemberProfile={(memberId) => {
            setSelectedMemberId(memberId);
            setActiveTab('member-profile');
            navigate(ROUTES.USER.MEMBER_PROFILE, { replace: false });
          }}
        />
      );
    }

    // ===== Module: Hồ sơ & Thành viên =====
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
            navigate(ROUTES.USER.MEMBERS, { replace: false });
          }}
        />
      );
    }

    // ===== Module: Mạng lưới Liên họ =====
    if (activeTab === 'net-noi') return <FamilyPaternalTab />;
    if (activeTab === 'net-ngoai') return <FamilyMaternalTab />;
    if (activeTab === 'net-dau-re') return <InLawMarriagesTab />;
    if (activeTab === 'net-thong-gia') return <AffiliatedFamiliesTab />;

    return (
      <MemberDashboard
        userName={displayUserName}
        userRole={userRole}
        onNavigateTab={handleSelectTab}
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
        onNavigateTab={handleSelectTab}
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
          style={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}
        >
          {primaryRole === 'admin' && (
            <div
              style={{
                position: 'fixed',
                top: '50%',
                right: '-10%',
                transform: 'translateY(-50%)',
                width: '900px',
                height: '900px',
                backgroundImage: `url(${trongDongBg})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: 0.15,
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {renderMainContent()}
          </div>
        </main>
      </div>

      <footer className="dashboard-footer">
        <div className="dashboard-footer-inner">
          <strong className="dashboard-footer-brand">MULTI-FAMILY GENEALOGY SYSTEM</strong>  2026 •
          Số hóa & Gắn kết các dòng họ Việt Nam.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
