import React from 'react';

import SystemAdminLayout from '../shared/Layout/SystemAdminLayout';
import { AdminDashboard } from '../shared/dashboard/AdminDashboard/AdminDashboard';
import AdminBusinessRequests from '../components/system-admin/AdminBusinessRequests/AdminBusinessRequests';
import AdminBusinessesMgmt from '../components/system-admin/AdminBusinessesMgmt/AdminBusinessesMgmt';
import AdminPlansMgmt from '../components/system-admin/AdminPlansMgmt/AdminPlansMgmt';
import AdminPaymentsMgmt from '../components/system-admin/AdminPaymentsMgmt/AdminPaymentsMgmt';
import AdminAccountMgmt from '../components/system-admin/AdminAccountMgmt/AdminAccountMgmt';
import AdminManagerTransfer from '../components/system-admin/AdminManagerTransfer/AdminManagerTransfer';
import AdminReportsMgmt from '../components/system-admin/AdminReportsMgmt/AdminReportsMgmt';
import AdminAuditLogsMgmt from '../components/system-admin/AdminAuditLogsMgmt/AdminAuditLogsMgmt';
import AdminDataBackupMgmt from '../components/system-admin/AdminDataBackupMgmt/AdminDataBackupMgmt';
import AdminSupportAccess from '../components/system-admin/AdminSupportAccess/AdminSupportAccess';
import AdminSecurity from '../components/system-admin/AdminSecurity/AdminSecurity';

import AdminProfilePage from '../components/system-admin/AdminProfile/AdminProfilePage';
import AdminSettingsPage from '../components/system-admin/AdminSettings/AdminSettingsPage';

import ClanAdminLayout from '../shared/Layout/ClanAdminLayout';
import DashboardPage from '../components/clan-admin/Dashboard/DashboardPage';
// ... rest imports are fine, wait I need to insert it correctly

import ClanProfileMgmt from '../components/clan-admin/FamilyProfile/ClanProfileMgmt';
import AncestorsPage from '../components/clan-admin/Ancestors/AncestorsPage';
import BranchesPage from '../components/clan-admin/Branches/BranchesPage';
import FamilyAdminsPage from '../components/clan-admin/FamilyAdmins/FamilyAdminsPage';
import ClanMembersMgmt from '../components/clan-admin/Members/ClanMembersMgmt';
import PersonsPage from '../components/clan-admin/Persons/PersonsPage';
import RelationshipsPage from '../components/clan-admin/Relationships/RelationshipsPage';
import GenealogyTreePage from '../components/clan-admin/GenealogyTree/GenealogyTreePage';
import SearchPage from '../components/clan-admin/Search/SearchPage';
import MemorialDaysPage from '../components/clan-admin/MemorialDays/MemorialDaysPage';
import EventsPage from '../components/clan-admin/Events/EventsPage';
import FundsPage from '../components/clan-admin/Funds/FundsPage';
import ArchivesPage from '../components/clan-admin/Archives/ArchivesPage';
import AIPage from '../components/clan-admin/AI/AIPage';
import WorshipSpacePage from '../components/clan-admin/WorshipSpace/WorshipSpacePage';
import Library3DPage from '../components/clan-admin/3DLibrary/Library3DPage';
import ImportExportPage from '../components/clan-admin/ImportExport/ImportExportPage';
import BusinessPage from '../components/clan-admin/Business/BusinessPage';
import PrivacyPage from '../components/clan-admin/Privacy/PrivacyPage';
import ClanApprovalsMgmt from '../components/clan-admin/Approvals/ClanApprovalsMgmt';
import ClanFamilyLinksMgmt from '../components/clan-admin/InterFamily/ClanFamilyLinksMgmt';
import ClanAccountMgmt from '../components/clan-admin/Settings/ClanAccountMgmt';
import ClanAuditLogsMgmt from '../components/clan-admin/AuditLogs/ClanAuditLogsMgmt';
import ClanDataBackupMgmt from '../components/clan-admin/Backup/ClanDataBackupMgmt';
import ProfilePage from '../components/clan-admin/Profile/ProfilePage';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';

import { ProtectedRoute, RoleGuard } from './RouteGuards';

export type AuthView = 'login' | 'register' | 'forgot-password' | 'dashboard';

interface AppRoutesProps {
  userName: string;
  primaryRole: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  userName,
  primaryRole,
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    if (primaryRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage
            onSwitchToRegister={() => navigate('/register')}
            onSwitchToForgotPassword={() => navigate('/forgot-password')}
            onSuccess={handleAuthSuccess}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterPage
            onSwitchToLogin={() => navigate('/login')}
            onSuccess={handleAuthSuccess}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage onSwitchToLogin={() => navigate('/login')} />
        }
      />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin']}>
            <SystemAdminLayout />
          </RoleGuard>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard userName="Quản Trị Viên" onNavigateTab={() => {}} />} />
        <Route path="business-requests" element={<AdminBusinessRequests onNavigateToCreateBusiness={() => {}} />} />
        <Route path="businesses" element={<AdminBusinessesMgmt />} />
        <Route path="manager-transfer" element={<AdminManagerTransfer />} />
        <Route path="plans" element={<AdminPlansMgmt />} />
        <Route path="payments" element={<AdminPaymentsMgmt />} />
        <Route path="accounts" element={<AdminAccountMgmt />} />
        <Route path="reports" element={<AdminReportsMgmt />} />
        <Route path="audit-logs" element={<AdminAuditLogsMgmt />} />
        <Route path="backup" element={<AdminDataBackupMgmt />} />
        <Route path="support-access" element={<AdminSupportAccess />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      
      {/* Clan Admin Routes */}
      <Route path="/clan-admin" element={<ClanAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="family-profile" element={<ClanProfileMgmt />} />
          <Route path="ancestors" element={<AncestorsPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="family-admins" element={<FamilyAdminsPage />} />
          <Route path="members" element={<ClanMembersMgmt />} />
          <Route path="persons" element={<PersonsPage />} />
          <Route path="relationships" element={<RelationshipsPage />} />
          <Route path="genealogy-tree" element={<GenealogyTreePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="inter-family" element={<ClanFamilyLinksMgmt />} />
          <Route path="approvals" element={<ClanApprovalsMgmt />} />
          <Route path="memorial-days" element={<MemorialDaysPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="funds" element={<FundsPage />} />
          <Route path="archives" element={<ArchivesPage />} />
          <Route path="import-export" element={<ImportExportPage />} />
          <Route path="ai" element={<AIPage />} />
          <Route path="worship-space" element={<WorshipSpacePage />} />
          <Route path="3d-library" element={<Library3DPage />} />
          <Route path="business" element={<BusinessPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="settings" element={<ClanAccountMgmt />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="backup" element={<ClanDataBackupMgmt />} />
          <Route path="audit-logs" element={<ClanAuditLogsMgmt />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
