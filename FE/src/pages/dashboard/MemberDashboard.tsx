import React, { useState } from 'react';
import RoleRequestModal from '../../components/roleRequest/RoleRequestModal';
import './Dashboard.css';

interface MemberDashboardProps {
  userName: string;
  onLogout: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ userName, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title-area">
          <span className="role-badge member">🌿 THÀNH VIÊN GIA TỘC</span>
          <h2>Trang Tra Cứu Gia Phả & Kết Nối Họ Hàng</h2>
        </div>
        <div className="user-profile-widget">
          <span>Xin chào, <strong>{userName}</strong></span>
          <button onClick={onLogout} className="logout-button">Đăng xuất</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-banner">
          <div className="banner-text">
            <h3>Chào mừng bạn đến với Hệ Thống Gia Phả Liên Họ</h3>
            <p>Tra cứu thông tin tổ tiên, xem cây phả hệ dòng họ và kết nối với các chi tộc.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-request-role">
            ⭐ Yêu cầu quyền Trưởng Họ
          </button>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h3>Tính Năng Thành Viên</h3>
          </div>

          <div className="action-cards-grid">
            <div className="action-card">
              <div className="card-icon">🔍</div>
              <h4>Tra Cứu Gia Phả</h4>
              <p>Tìm kiếm thông tin tổ tiên, chi tộc và xem sơ đồ phả hệ dòng họ.</p>
              <button className="card-action-btn">Tra Cứu Ngay</button>
            </div>

            <div className="action-card">
              <div className="card-icon">🤝</div>
              <h4>Mạng Lưới Họ Hàng</h4>
              <p>Khám phá mối quan hệ liên họ và kết nối với bà con dòng tộc.</p>
              <button className="card-action-btn">Xem Mạng Lưới</button>
            </div>

            <div className="action-card">
              <div className="card-icon">👤</div>
              <h4>Hồ Sơ Cá Nhân</h4>
              <p>Quản lý thông tin cá nhân, ngày sinh và cập nhật thế hệ gia đình.</p>
              <button className="card-action-btn">Cập Nhật Hồ Sơ</button>
            </div>
          </div>
        </section>
      </main>

      <RoleRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Modal automatically handles success alert
        }}
      />
    </div>
  );
};

export default MemberDashboard;
