import React, { useState } from 'react';
import { TopBar } from '../../components/dashboard/TopBar';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { PersonalizedOverview } from '../../components/dashboard/PersonalizedOverview';
import { UpcomingEventsWidget } from '../../components/dashboard/UpcomingEventsWidget';
import { RecentActivitiesWidget } from '../../components/dashboard/RecentActivitiesWidget';

export interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole] = useState<'Admin' | 'Trưởng họ' | 'Thành viên'>('Trưởng họ');

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId.startsWith('tree')) {
      alert(`Đang chuyển tới trang Cây Gia Phả: ${tabId}`);
    } else if (tabId.startsWith('net')) {
      alert(`Đang chuyển tới trang Mạng lưới Liên họ: ${tabId}`);
    } else if (tabId.startsWith('member')) {
      alert(`Đang chuyển tới trang Hồ sơ & Thành viên: ${tabId}`);
    } else if (tabId.startsWith('finder')) {
      alert(`Đang chuyển tới trang Tra cứu quan hệ: ${tabId}`);
    } else if (tabId.startsWith('admin')) {
      alert(`Đang chuyển tới Quản trị hệ thống: ${tabId}`);
    }
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
          <PersonalizedOverview
            userName={userName}
            familyBranch="Họ Nguyễn (Chi Trưởng)"
            generationLevel="Đời thứ 7"
            totalMembers={128}
            linkedFamiliesCount={4}
          />

          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
    </div>
  );
};

export default Dashboard;
