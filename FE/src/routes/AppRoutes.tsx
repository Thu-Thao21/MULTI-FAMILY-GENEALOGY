import React from 'react';
import ClanAdminLayout from '../components/shared/Layout/ClanAdminLayout';
import DashboardPage from '../pages/clan-admin/Dashboard/DashboardPage';
import ClanProfileMgmt from '../pages/clan-admin/FamilyProfile/ClanProfileMgmt';
import AncestorsPage from '../pages/clan-admin/Ancestors/AncestorsPage';
import BranchesPage from '../pages/clan-admin/Branches/BranchesPage';
import FamilyAdminsPage from '../pages/clan-admin/FamilyAdmins/FamilyAdminsPage';
import ClanMembersMgmt from '../pages/clan-admin/Members/ClanMembersMgmt';
import PersonsPage from '../pages/clan-admin/Persons/PersonsPage';
import RelationshipsPage from '../pages/clan-admin/Relationships/RelationshipsPage';
import GenealogyTreePage from '../pages/clan-admin/GenealogyTree/GenealogyTreePage';
import SearchPage from '../pages/clan-admin/Search/SearchPage';
import MemorialDaysPage from '../pages/clan-admin/MemorialDays/MemorialDaysPage';
import EventsPage from '../pages/clan-admin/Events/EventsPage';
import FundsPage from '../pages/clan-admin/Funds/FundsPage';
import ArchivesPage from '../pages/clan-admin/Archives/ArchivesPage';
import AIPage from '../pages/clan-admin/AI/AIPage';
import WorshipSpacePage from '../pages/clan-admin/WorshipSpace/WorshipSpacePage';
import Library3DPage from '../pages/clan-admin/3DLibrary/Library3DPage';
import ImportExportPage from '../pages/clan-admin/ImportExport/ImportExportPage';
import BusinessPage from '../pages/clan-admin/Business/BusinessPage';
import PrivacyPage from '../pages/clan-admin/Privacy/PrivacyPage';
import ClanApprovalsMgmt from '../pages/clan-admin/Approvals/ClanApprovalsMgmt';
import ClanFamilyLinksMgmt from '../pages/clan-admin/InterFamily/ClanFamilyLinksMgmt';
import ClanAccountMgmt from '../pages/clan-admin/Settings/ClanAccountMgmt';
import ClanAuditLogsMgmt from '../pages/clan-admin/AuditLogs/ClanAuditLogsMgmt';
import ClanDataBackupMgmt from '../pages/clan-admin/Backup/ClanDataBackupMgmt';
import ProfilePage from '../pages/clan-admin/Profile/ProfilePage';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
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
      navigate('/user');
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
      <Route
        path="/user/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['member', 'family_head']}>
              <Dashboard userName={userName} onLogout={handleLogout} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <Dashboard userName={userName} onLogout={handleLogout} />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      
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
