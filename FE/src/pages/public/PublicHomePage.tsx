import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/guest/PublicLayout';
import { ROUTES } from '../../config/routes';
import familyTreeImage from '../../assets/cay3.png';
import './PublicHomePage.css';

export const PublicHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="pub-home-container">
        {/* Hero Banner Section */}
        <section className="pub-hero-card">
          <div className="pub-hero-grid">
            <div className="pub-hero-info">
              <span className="pub-hero-badge">HỆ THỐNG GIA PHẢ LIÊN HỌ HÀNG ĐẦU VIỆT NAM</span>
              <h1 className="pub-hero-title">
                Số Hóa Gia Phả Dòng Họ Việt
              </h1>
              <div className="pub-hero-subtitle">
                <span className="pub-hero-sub-item">Gắn Kết Dòng Họ</span>
                <span className="pub-hero-sub-sep" aria-hidden="true">–</span>
                <span className="pub-hero-sub-item">Lưu Truyền Thế Hệ</span>
                <span className="pub-hero-sub-sep" aria-hidden="true">–</span>
                <span className="pub-hero-sub-item">Kết Nối Liên Họ</span>
              </div>
              <p className="pub-hero-desc">
                Nền tảng quản lý sơ đồ gia phả đa thế hệ, tra cứu trực hệ, lưu trữ tư liệu cổ, tổ chức ngày giỗ & sự kiện gia tộc chuyên nghiệp.
              </p>

              <div className="pub-hero-buttons">
                <button
                  className="pub-btn-primary"
                  onClick={() => navigate(ROUTES.PUBLIC.FAMILIES)}
                >
                  Tra Cứu Dòng Họ (Public)
                </button>
                <button
                  className="pub-btn-secondary"
                  onClick={() => navigate(ROUTES.PUBLIC.BUSINESS_REGISTER)}
                >
                  Đăng Ký Dòng Họ Business
                </button>
              </div>
            </div>

            <div className="pub-hero-image-box">
              <img src={familyTreeImage} alt="Family Tree Graphic" className="pub-hero-img" />
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="pub-features-section">
          <h2 className="section-heading">Tính Năng Nổi Bật Dành Cho Dòng Họ</h2>

          <div className="pub-features-grid">
            <div className="pub-feature-card">
              <h3 className="feature-title">Cây Gia Phả Tương Tác</h3>
              <p className="feature-desc">
                Sơ đồ cây trực hệ đa thế hệ dọc/ngang, Focus View, thu mở nhánh linh hoạt với quy mô hàng nghìn thành viên.
              </p>
            </div>

            <div className="pub-feature-card">
              <h3 className="feature-title">Mạng Lưới Liên Họ</h3>
              <p className="feature-desc">
                Kết nối dòng họ Nội, Ngoại, Dâu/Rể, Thông gia với chính sách phân quyền chia sẻ dữ liệu an toàn.
              </p>
            </div>

            <div className="pub-feature-card">
              <h3 className="feature-title">Tra Cứu & Xưng Hô Tự Động</h3>
              <p className="feature-desc">
                Tính toán chuỗi quan hệ A → B và suy luận danh xưng phong tục Việt Nam chuẩn xác.
              </p>
            </div>

            <div className="pub-feature-card">
              <h3 className="feature-title">Phòng Thờ Số & Ngày Giỗ</h3>
              <p className="feature-desc">
                Thắp hương tưởng niệm trực tuyến, viết lời tưởng niệm và nhận thông báo nhắc nhở giỗ Âm/Dương lịch.
              </p>
            </div>

            <div className="pub-feature-card">
              <h3 className="feature-title">Trợ Lý AI Gia Phả</h3>
              <p className="feature-desc">
                Hỏi đáp thông minh về thủy tổ, nguồn gốc dòng họ và phân tích thống kê nhân khẩu gia tộc.
              </p>
            </div>

            <div className="pub-feature-card">
              <h3 className="feature-title">Bảo Mật & Phân Quyền</h3>
              <p className="feature-desc">
                Bảo vệ riêng tư 4 mức (PUBLIC, FAMILY, ADMIN_ONLY, PRIVATE). Khách vãng lai chỉ xem dữ liệu công khai.
              </p>
            </div>
          </div>
        </section>

        {/* Quick CTA Banner */}
        <section className="pub-cta-card">
          <div>
            <h2 className="cta-title">Bạn Đã Được Cấp Mã Kích Hoạt Gia Nhập Dòng Họ?</h2>
            <p className="cta-desc">Mở link lời mời hoặc nhập mã kích hoạt để bắt đầu truy cập cây gia phả cá nhân.</p>
          </div>
          <button className="pub-btn-light" onClick={() => navigate(ROUTES.ACTIVATION)}>
            Kích Hoạt Mã Lời Mời ➔
          </button>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PublicHomePage;
