import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/guest/PublicLayout';
import { ROUTES } from '../../config/routes';
import './BusinessPlansView.css';

export interface BusinessTier {
  id: string;
  name: string;
  badge?: string;
  memberLimit: string;
  storage: string;
  pricePeriod: string;
  features: string[];
  recommended?: boolean;
}

export const BusinessPlansView: React.FC = () => {
  const navigate = useNavigate();

  const tiers: BusinessTier[] = [
    {
      id: 'tier-basic',
      name: 'Gói Dòng Họ Tiêu Chuẩn',
      memberLimit: 'Tối đa 200 Thành viên',
      storage: '10 GB Lưu trữ tư liệu',
      pricePeriod: 'Gói khởi tạo cơ bản',
      features: [
        'Sơ đồ Cây gia phả trực hệ (Dọc/Ngang)',
        'Quản lý danh sách thành viên & hồ sơ',
        'Lịch ngày giỗ & Nhắc nhở qua App',
        'Phòng thờ số 2D tưởng niệm',
        'Phân quyền riêng tư PUBLIC / FAMILY',
      ],
    },
    {
      id: 'tier-pro',
      name: 'Gói Dòng Họ Chuyên Nghiệp',
      badge: 'Phổ biến nhất',
      recommended: true,
      memberLimit: 'Tối đa 1.000 Thành viên',
      storage: '50 GB Lưu trữ tư liệu cổ',
      pricePeriod: 'Đầy đủ tính năng nâng cao',
      features: [
        'Tất cả tính năng của Gói Tiêu Chuẩn',
        'Mạng lưới Liên họ (Nội/Ngoại/Thông gia)',
        'Tra cứu quan hệ A → B & Xưng hô tự động',
        'AI Assistant hỗ trợ hỏi đáp dòng họ',
        'Quản lý quỹ & Lịch sử đóng góp',
        'Xuất file PDF gia phả & Báo cáo',
      ],
    },
    {
      id: 'tier-enterprise',
      name: 'Gói Đại Tộc Không Giới Hạn',
      memberLimit: 'Không giới hạn thành viên',
      storage: '500 GB Lưu trữ tư liệu',
      pricePeriod: 'Dành cho các tộc họ lớn',
      features: [
        'Tất cả tính năng Gói Chuyên Nghiệp',
        'Hỗ trợ nhiều Chi/Nhánh song song',
        'Phòng thờ số không gian 3D nâng cao',
        'Ưu tiên hỗ trợ kỹ thuật 24/7',
        'Sao lưu dữ liệu định kỳ tự động',
      ],
    },
  ];

  return (
    <PublicLayout>
      <div className="plans-container">
        <div className="plans-header">
          <span className="plans-badge">DÀNH CHO ĐẠI DIỆN DÒNG HỌ / TRƯỞNG TỘC</span>
          <h1 className="plans-title">Bảng Gói Dịch Vụ Dòng Họ Business (FR-GU-02)</h1>
          <p className="plans-subtitle">
            Lựa chọn gói dịch vụ phù hợp với quy mô thành viên và nhu cầu số hóa của dòng họ bạn.
          </p>
        </div>

        <div className="plans-cards-grid">
          {tiers.map((t) => (
            <div key={t.id} className={`plan-card ${t.recommended ? 'recommended' : ''}`}>
              {t.badge && <span className="plan-recom-badge">{t.badge}</span>}

              <h3 className="plan-name">{t.name}</h3>
              <div className="plan-limit">{t.memberLimit}</div>
              <div className="plan-storage">💾 {t.storage}</div>

              <div className="plan-divider" />

              <ul className="plan-features-list">
                {t.features.map((feat, idx) => (
                  <li key={idx}>✓ {feat}</li>
                ))}
              </ul>

              <button
                className={`select-plan-btn ${t.recommended ? 'primary' : ''}`}
                onClick={() => navigate(`${ROUTES.PUBLIC.BUSINESS_REGISTER}?tier=${t.id}`)}
              >
                Chọn Gói Này ➔
              </button>
            </div>
          ))}
        </div>

        <div className="plans-note-card">
          ℹ️ Thông tin về bảng giá và giới hạn được tải động từ cấu hình hệ thống. Mọi thủ tục đăng ký Business sẽ được Quản trị viên thẩm định trước khi cấp quyền Owner.
        </div>
      </div>
    </PublicLayout>
  );
};

export default BusinessPlansView;
