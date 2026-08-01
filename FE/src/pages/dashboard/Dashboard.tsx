import React, { useState } from 'react';
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
import type { TreeViewMode } from '../../types/tree';

export interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole] = useState<'Admin' | 'Trưởng họ' | 'Thành viên'>('Trưởng họ');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isProcessingToastOpen, setIsProcessingToastOpen] = useState(false);
  const [toastIcon, setToastIcon] = useState('🌳');

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'member-list') {
      setSelectedMemberId(null);
    } else if (tabId === 'member-profile') {
      setSelectedMemberId('member_006');
    } else if (
      tabId === 'net-noi' ||
      tabId === 'net-ngoai' ||
      tabId === 'net-dau-re' ||
      tabId === 'net-thong-gia' ||
      tabId.startsWith('tree')
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
      return (
        <ProfileLayout
          memberId={selectedMemberId || 'member_006'}
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
    return (
      <>
        <PersonalizedOverview
          userName={userName}
          familyBranch="Họ Nguyễn (Chi Trưởng)"
          generationLevel="Đời thứ 7"
          totalMembers={128}
          linkedFamiliesCount={4}
        />

        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 4px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Đời Sống & Sự Kiện Gia Tộc
            </h2>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
              Theo dõi lịch giỗ tổ, mừng thọ và các cập nhật mới nhất trong gia phả.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            <UpcomingEventsWidget />
            <RecentActivitiesWidget />
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar
        userName={userName}
        userRole={userRole}
        onLogout={onLogout}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
          userRole={userRole}
        />

        <main
          style={{
            flex: 1,
            maxWidth: isSidebarCollapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 280px)',
            padding: '32px 36px 60px',
            overflowX: 'hidden',
          }}
        >
          {renderMainContent()}
        </main>
      </div>

      <footer
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '13px',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <strong style={{ color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            MULTI-FAMILY GENEALOGY SYSTEM
          </strong>{' '}
          © 2026 • Số hóa & Gắn kết các dòng họ Việt Nam.
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
