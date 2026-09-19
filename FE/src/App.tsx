import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClanAdminLayout from './components/shared/Layout/ClanAdminLayout';

// Existing pages (Moved from components)
import DashboardPage from './pages/clan-admin/Dashboard/DashboardPage';
import ClanProfileMgmt from './pages/clan-admin/FamilyProfile/ClanProfileMgmt';
import AncestorsPage from './pages/clan-admin/Ancestors/AncestorsPage';
import BranchesPage from './pages/clan-admin/Branches/BranchesPage';
import FamilyAdminsPage from './pages/clan-admin/FamilyAdmins/FamilyAdminsPage';
import ClanMembersMgmt from './pages/clan-admin/Members/ClanMembersMgmt';
import PersonsPage from './pages/clan-admin/Persons/PersonsPage';
import RelationshipsPage from './pages/clan-admin/Relationships/RelationshipsPage';
import GenealogyTreePage from './pages/clan-admin/GenealogyTree/GenealogyTreePage';
import SearchPage from './pages/clan-admin/Search/SearchPage';
import MemorialDaysPage from './pages/clan-admin/MemorialDays/MemorialDaysPage';
import EventsPage from './pages/clan-admin/Events/EventsPage';
import FundsPage from './pages/clan-admin/Funds/FundsPage';
import ArchivesPage from './pages/clan-admin/Archives/ArchivesPage';
import AIPage from './pages/clan-admin/AI/AIPage';
import WorshipSpacePage from './pages/clan-admin/WorshipSpace/WorshipSpacePage';
import Library3DPage from './pages/clan-admin/3DLibrary/Library3DPage';
import ImportExportPage from './pages/clan-admin/ImportExport/ImportExportPage';
import BusinessPage from './pages/clan-admin/Business/BusinessPage';
import PrivacyPage from './pages/clan-admin/Privacy/PrivacyPage';
import ClanApprovalsMgmt from './pages/clan-admin/Approvals/ClanApprovalsMgmt';
import ClanFamilyLinksMgmt from './pages/clan-admin/InterFamily/ClanFamilyLinksMgmt';
import ClanAccountMgmt from './pages/clan-admin/Settings/ClanAccountMgmt';
import ClanAuditLogsMgmt from './pages/clan-admin/AuditLogs/ClanAuditLogsMgmt';
import ClanDataBackupMgmt from './pages/clan-admin/Backup/ClanDataBackupMgmt';
import ProfilePage from './pages/clan-admin/Profile/ProfilePage';

import './App.css';

// Placeholder UI component for pages under construction
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 m-0">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">Đang xây dựng giao diện chi tiết...</p>
      </div>
      <div className="p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-slate-700">Comming Soon</h3>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/clan-admin/dashboard" replace />} />

        {/* Clan Admin Routes */}
        <Route path="/clan-admin" element={<ClanAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Dòng họ */}
          <Route path="family-profile" element={<ClanProfileMgmt />} />
          <Route path="ancestors" element={<AncestorsPage />} />
          <Route path="branches" element={<BranchesPage />} />

          {/* Thành viên & Phân quyền */}
          <Route path="family-admins" element={<FamilyAdminsPage />} />
          <Route path="members" element={<ClanMembersMgmt />} />
          <Route path="persons" element={<PersonsPage />} />

          {/* Gia phả */}
          <Route path="relationships" element={<RelationshipsPage />} />
          <Route path="genealogy-tree" element={<GenealogyTreePage />} />
          <Route path="search" element={<SearchPage />} />

          {/* Liên họ */}
          <Route path="inter-family" element={<ClanFamilyLinksMgmt />} />

          {/* Hoạt động */}
          <Route path="approvals" element={<ClanApprovalsMgmt />} />
          <Route path="memorial-days" element={<MemorialDaysPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="funds" element={<FundsPage />} />

          {/* Tư liệu */}
          <Route path="archives" element={<ArchivesPage />} />
          <Route path="import-export" element={<ImportExportPage />} />

          {/* AI */}
          <Route path="ai" element={<AIPage />} />

          {/* Không gian thờ cúng */}
          <Route path="worship-space" element={<WorshipSpacePage />} />
          <Route path="3d-library" element={<Library3DPage />} />

          {/* Quản trị */}
          <Route path="business" element={<BusinessPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="settings" element={<ClanAccountMgmt />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="backup" element={<ClanDataBackupMgmt />} />
          <Route path="audit-logs" element={<ClanAuditLogsMgmt />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
