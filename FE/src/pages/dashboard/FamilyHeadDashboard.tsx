import React from 'react';
import './Dashboard.css';

interface FamilyHeadDashboardProps {
  userName: string;
  onLogout: () => void;
}

export const FamilyHeadDashboard: React.FC<FamilyHeadDashboardProps> = ({ userName, onLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title-area">
          <span className="role-badge family-head">📜 TRƯỞNG HỌ (FAMILY HEAD)</span>
          <h2>Quản Lý Gia Phả & Chi Tộc Dòng Họ</h2>
        </div>
        <div className="user-profile-widget">
          <span>Xin chào Trưởng Họ, <strong>{userName}</strong></span>
          <button onClick={onLogout} className="logout-button">Đăng xuất</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Chi Tộc Quản Lý</h3>
            <p className="stat-number">01</p>
          </div>
          <div className="stat-card">
            <h3>Thành Viên Dòng Họ</h3>
            <p className="stat-number">128</p>
          </div>
          <div className="stat-card">
            <h3>Quyền Hạn</h3>
            <p className="stat-role">Quản trị Cây Gia Phả</p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h3>Bảng Điều Khiển Trưởng Họ</h3>
          </div>

          <div className="action-cards-grid">
            <div className="action-card">
              <div className="card-icon">🌳</div>
              <h4>Cây Gia Phả Dòng Họ</h4>
              <p>Quản lý sơ đồ phả hệ, thêm bớt thế hệ và thông tin chi tộc.</p>
              <button className="card-action-btn">Vào Quản Lý Cây</button>
            </div>

            <div className="action-card">
              <div className="card-icon">👥</div>
              <h4>Danh Sách Thành Viên</h4>
              <p>Phê duyệt hồ sơ thành viên mới tham gia vào cây gia phả dòng họ.</p>
              <button className="card-action-btn">Duyệt Thành Viên</button>
            </div>

            <div className="action-card">
              <div className="card-icon">📖</div>
              <h4>Sử Tộc & Ngày Giỗ</h4>
              <p>Cập nhật văn khấn, sử tộc dòng họ và lịch giỗ tổ tiên hàng năm.</p>
              <button className="card-action-btn">Cập Nhật Sử Tộc</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FamilyHeadDashboard;
