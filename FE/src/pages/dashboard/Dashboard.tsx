import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar } from '../../components/dashboard/TopBar';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { MemberList } from '../../components/profile/MemberList';
import { ProfileLayout } from '../../components/profile/ProfileLayout';
import { NotificationModal } from '../../components/common/NotificationModal';
import { FamilyPaternalTab } from '../../components/network/FamilyPaternalTab';
import { FamilyMaternalTab } from '../../components/network/FamilyMaternalTab';
import { InLawMarriagesTab } from '../../components/network/InLawMarriagesTab';
import { AffiliatedFamiliesTab } from '../../components/network/AffiliatedFamiliesTab';
import { TreeLayout } from '../../components/tree/TreeLayout';
import { MemberDashboard, AdminDashboard } from '../../components/roles';

import AdminAccountMgmt from '../../components/admin/AdminAccountMgmt/AdminAccountMgmt';
import AdminFamiliesMgmt from '../../components/admin/AdminFamiliesMgmt/AdminFamiliesMgmt';
import AdminMembersMgmt from '../../components/admin/AdminMembersMgmt/AdminMembersMgmt';
import AdminFamilyLinksMgmt from '../../components/admin/AdminFamilyLinksMgmt/AdminFamilyLinksMgmt';
import AdminApprovalsMgmt from '../../components/admin/AdminApprovalsMgmt/AdminApprovalsMgmt';
import AdminAuditLogsMgmt from '../../components/admin/AdminAuditLogsMgmt/AdminAuditLogsMgmt';
import AdminDataBackupMgmt from '../../components/admin/AdminDataBackupMgmt/AdminDataBackupMgmt';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/routes';
import type { TreeViewMode } from '../../types/tree';
import './Dashboard.css';

// ===== Tab ID ↔ URL Route Mapping =====
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
  // Admin tabs (from Sidebar "Quản trị hệ thống")
  'admin-permissions':    ROUTES.ADMIN.ACCOUNTS,
  'admin-approval':       ROUTES.ADMIN.APPROVALS,
  'admin-logs':           ROUTES.ADMIN.SECURITY_LOGS,
  // Admin tabs (from AdminDashboard cards)
  'admin-account-mgmt':   ROUTES.ADMIN.ACCOUNTS,
  'admin-families-mgmt':  ROUTES.ADMIN.FAMILIES,
  'admin-members-mgmt':   ROUTES.ADMIN.MEMBERS,
  'admin-family-links':   ROUTES.ADMIN.FAMILY_LINKS,
  'admin-approvals':      ROUTES.ADMIN.APPROVALS,
  'admin-security-logs':  ROUTES.ADMIN.SECURITY_LOGS,
  'admin-data-backup':    ROUTES.ADMIN.BACKUP,
};

// Reverse: URL route → tab ID (longest match first)
const ROUTE_TO_TAB: Array<[string, string]> = [
  // Admin routes
  [ROUTES.ADMIN.ACCOUNTS,      'admin-permissions'],
  [ROUTES.ADMIN.FAMILIES,      'admin-families-mgmt'],
  [ROUTES.ADMIN.MEMBERS,       'admin-members-mgmt'],
  [ROUTES.ADMIN.FAMILY_LINKS,  'admin-family-links'],
  [ROUTES.ADMIN.APPROVALS,     'admin-approval'],
  [ROUTES.ADMIN.SECURITY_LOGS, 'admin-logs'],
  [ROUTES.ADMIN.BACKUP,        'admin-data-backup'],
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
  const [isProcessingToastOpen, setIsProcessingToastOpen] = useState(false);
  const [toastIcon, setToastIcon] = useState('🌳');

  const displayUserName = account?.display_name || account?.username || firebaseUser?.displayName || userName || 'Người dùng';
  const primaryRole = account?.primary_role || 'member';
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
    const route = TAB_TO_ROUTE[tabId];
    if (route) {
      navigate(route, { replace: false });
    } else if (tabId === 'dashboard') {
      navigate(basePath, { replace: false });
    }

    // Handle special behaviors
    if (tabId === 'member-list') {
      setSelectedMemberId(null);
    } else if (tabId === 'member-profile') {
      // keep selectedMemberId
    } else if (tabId === 'member-add') {
      setToastIcon('👤');
      setIsProcessingToastOpen(true);
    } else if (tabId === 'finder-auto' || tabId === 'finder-path') {
      setToastIcon('🔍');
      setIsProcessingToastOpen(true);
    } else if (tabId === 'export-pdf' || tabId === 'export-excel') {
      setToastIcon('📄');
      setIsProcessingToastOpen(true);
    } else if (tabId === 'import-data') {
      setToastIcon('📥');
      setIsProcessingToastOpen(true);
    } else if (tabId === 'admin-role-requests') {
      setToastIcon('⭐');
      setIsProcessingToastOpen(true);
    }
  }, [navigate, basePath]);

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('member-profile');
    navigate(ROUTES.USER.MEMBER_PROFILE, { replace: false });
  };

  const renderMainContent = () => {
    // ===== Branch for System Admin =====
    if (primaryRole === 'admin') {
      if (activeTab === 'admin-permissions' || activeTab === 'admin-account-mgmt') return <AdminAccountMgmt />;
      if (activeTab === 'admin-families-mgmt') return <AdminFamiliesMgmt />;
      if (activeTab === 'admin-members-mgmt') return <AdminMembersMgmt />;
      if (activeTab === 'admin-family-links') return <AdminFamilyLinksMgmt />;
      if (activeTab === 'admin-approval' || activeTab === 'admin-approvals') return <AdminApprovalsMgmt />;
      if (activeTab === 'admin-logs' || activeTab === 'admin-security-logs') return <AdminAuditLogsMgmt />;
      if (activeTab === 'admin-data-backup') return <AdminDataBackupMgmt />;

      // Default Admin View
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
          initialMode={mode}
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
    </div>
  );
};

export default Dashboard;
