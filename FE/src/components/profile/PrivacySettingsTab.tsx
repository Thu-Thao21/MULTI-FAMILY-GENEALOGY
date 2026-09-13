import React, { useState } from 'react';
import './PrivacySettingsTab.css';

export interface PrivacySettingsTabProps {
  memberId?: string;
}

export type VisibilityLevel = 'PUBLIC' | 'FAMILY' | 'ADMIN_ONLY' | 'PRIVATE';

export const PrivacySettingsTab: React.FC<PrivacySettingsTabProps> = () => {
  const [emailVisibility, setEmailVisibility] = useState<VisibilityLevel>('FAMILY');
  const [phoneVisibility, setPhoneVisibility] = useState<VisibilityLevel>('FAMILY');
  const [addressVisibility, setAddressVisibility] = useState<VisibilityLevel>('FAMILY');
  const [occupationVisibility, setOccupationVisibility] = useState<VisibilityLevel>('PUBLIC');
  const [birthdateVisibility, setBirthdateVisibility] = useState<VisibilityLevel>('FAMILY');

  const [activePreviewRole, setActivePreviewRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN' | 'AFFILIATED'>('MEMBER');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sampleMemberData = {
    fullName: 'Nguyễn Văn A',
    generation: 4,
    email: 'nguyenvana@giaphaviet.vn',
    phone: '0912 345 678',
    address: 'Số 123 Đường Trần Hưng Đạo, Phường 1, TP. Hà Nội',
    occupation: 'Kỹ sư Phần mềm',
    birthDate: '1985-05-20',
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Helper to determine if field is visible under preview role
  const isVisibleInPreview = (level: VisibilityLevel): boolean => {
    if (level === 'PUBLIC') return true;
    if (level === 'FAMILY') return activePreviewRole === 'MEMBER' || activePreviewRole === 'ADMIN' || activePreviewRole === 'AFFILIATED';
    if (level === 'ADMIN_ONLY') return activePreviewRole === 'ADMIN';
    if (level === 'PRIVATE') return false; // Private is only visible to self
    return false;
  };

  return (
    <div className="privacy-page-container">
      <div className="privacy-header-card">
        <h2 className="privacy-title">Cài Đặt Quyền Riêng Tư Cá Nhân</h2>
        <p className="privacy-subtitle">
          Quản lý mức độ chia sẻ thông tin cá nhân của bạn trên hệ thống gia phả theo chính sách của dòng họ (FR-ME-07, ME-37).
        </p>
      </div>

      {savedSuccess && (
        <div className="privacy-success-toast">
          ✓ Đã lưu cài đặt quyền riêng tư thành công!
        </div>
      )}

      <div className="privacy-grid">
        {/* Left Column: Controls */}
        <form className="privacy-form-card" onSubmit={handleSave}>
          <h3 className="privacy-card-title">Cấu hình riêng tư cấp trường</h3>

          <div className="privacy-field-row">
            <div className="privacy-field-info">
              <span className="privacy-field-name">Địa chỉ Email</span>
              <span className="privacy-field-desc">Mặc định không công khai rộng rãi</span>
            </div>
            <select
              className="privacy-select"
              value={emailVisibility}
              onChange={(e) => setEmailVisibility(e.target.value as VisibilityLevel)}
            >
              <option value="PUBLIC">Công khai (Public)</option>
              <option value="FAMILY">Trong dòng họ (Family)</option>
              <option value="ADMIN_ONLY">Chỉ Quản trị viên (Admin Only)</option>
              <option value="PRIVATE">Chỉ mình tôi (Private)</option>
            </select>
          </div>

          <div className="privacy-field-row">
            <div className="privacy-field-info">
              <span className="privacy-field-name">Số điện thoại</span>
              <span className="privacy-field-desc">Liên hệ trực tiếp</span>
            </div>
            <select
              className="privacy-select"
              value={phoneVisibility}
              onChange={(e) => setPhoneVisibility(e.target.value as VisibilityLevel)}
            >
              <option value="PUBLIC">Công khai (Public)</option>
              <option value="FAMILY">Trong dòng họ (Family)</option>
              <option value="ADMIN_ONLY">Chỉ Quản trị viên (Admin Only)</option>
              <option value="PRIVATE">Chỉ mình tôi (Private)</option>
            </select>
          </div>

          <div className="privacy-field-row">
            <div className="privacy-field-info">
              <span className="privacy-field-name">Địa chỉ thường trú</span>
              <span className="privacy-field-desc">Nơi ở hiện tại</span>
            </div>
            <select
              className="privacy-select"
              value={addressVisibility}
              onChange={(e) => setAddressVisibility(e.target.value as VisibilityLevel)}
            >
              <option value="PUBLIC">Công khai (Public)</option>
              <option value="FAMILY">Trong dòng họ (Family)</option>
              <option value="ADMIN_ONLY">Chỉ Quản trị viên (Admin Only)</option>
              <option value="PRIVATE">Chỉ mình tôi (Private)</option>
            </select>
          </div>

          <div className="privacy-field-row">
            <div className="privacy-field-info">
              <span className="privacy-field-name">Nghề nghiệp & Học vấn</span>
              <span className="privacy-field-desc">Thông tin chuyên môn</span>
            </div>
            <select
              className="privacy-select"
              value={occupationVisibility}
              onChange={(e) => setOccupationVisibility(e.target.value as VisibilityLevel)}
            >
              <option value="PUBLIC">Công khai (Public)</option>
              <option value="FAMILY">Trong dòng họ (Family)</option>
              <option value="ADMIN_ONLY">Chỉ Quản trị viên (Admin Only)</option>
              <option value="PRIVATE">Chỉ mình tôi (Private)</option>
            </select>
          </div>

          <div className="privacy-field-row">
            <div className="privacy-field-info">
              <span className="privacy-field-name">Ngày sinh chính xác</span>
              <span className="privacy-field-desc">Ngày tháng năm sinh</span>
            </div>
            <select
              className="privacy-select"
              value={birthdateVisibility}
              onChange={(e) => setBirthdateVisibility(e.target.value as VisibilityLevel)}
            >
              <option value="PUBLIC">Công khai (Public)</option>
              <option value="FAMILY">Trong dòng họ (Family)</option>
              <option value="ADMIN_ONLY">Chỉ Quản trị viên (Admin Only)</option>
              <option value="PRIVATE">Chỉ mình tôi (Private)</option>
            </select>
          </div>

          <button type="submit" className="privacy-save-btn">
            Lưu cài đặt riêng tư
          </button>
        </form>

        {/* Right Column: Preview Simulation (FR-ME-38) */}
        <div className="privacy-preview-card">
          <div className="privacy-preview-header">
            <h3 className="privacy-card-title">Xem Trước Góc Nhìn (FR-ME-38)</h3>
            <p className="privacy-preview-subtitle">
              Mô phỏng dữ liệu hồ sơ hiển thị dưới góc nhìn của các đối tượng khác nhau mà không đổi role/session thật.
            </p>
          </div>

          <div className="privacy-role-tabs">
            <button
              type="button"
              className={`privacy-role-tab ${activePreviewRole === 'GUEST' ? 'active' : ''}`}
              onClick={() => setActivePreviewRole('GUEST')}
            >
              🌐 Khách vãng lai
            </button>
            <button
              type="button"
              className={`privacy-role-tab ${activePreviewRole === 'MEMBER' ? 'active' : ''}`}
              onClick={() => setActivePreviewRole('MEMBER')}
            >
              👥 Thành viên cùng họ
            </button>
            <button
              type="button"
              className={`privacy-role-tab ${activePreviewRole === 'AFFILIATED' ? 'active' : ''}`}
              onClick={() => setActivePreviewRole('AFFILIATED')}
            >
              🔗 Họ liên kết
            </button>
            <button
              type="button"
              className={`privacy-role-tab ${activePreviewRole === 'ADMIN' ? 'active' : ''}`}
              onClick={() => setActivePreviewRole('ADMIN')}
            >
              🛡️ Quản trị dòng họ
            </button>
          </div>

          <div className="privacy-preview-box">
            <div className="preview-profile-head">
              <div className="preview-avatar">A</div>
              <div>
                <h4 className="preview-name">{sampleMemberData.fullName}</h4>
                <span className="preview-gen">Thành viên Đời thứ {sampleMemberData.generation}</span>
              </div>
            </div>

            <div className="preview-fields-list">
              <div className="preview-field-item">
                <span className="preview-label">Email:</span>
                <span className="preview-value">
                  {isVisibleInPreview(emailVisibility) ? sampleMemberData.email : '🔒 [Đã ẩn do riêng tư]'}
                </span>
              </div>

              <div className="preview-field-item">
                <span className="preview-label">Số điện thoại:</span>
                <span className="preview-value">
                  {isVisibleInPreview(phoneVisibility) ? sampleMemberData.phone : '🔒 [Đã ẩn do riêng tư]'}
                </span>
              </div>

              <div className="preview-field-item">
                <span className="preview-label">Địa chỉ:</span>
                <span className="preview-value">
                  {isVisibleInPreview(addressVisibility) ? sampleMemberData.address : '🔒 [Đã ẩn do riêng tư]'}
                </span>
              </div>

              <div className="preview-field-item">
                <span className="preview-label">Nghề nghiệp:</span>
                <span className="preview-value">
                  {isVisibleInPreview(occupationVisibility) ? sampleMemberData.occupation : '🔒 [Đã ẩn do riêng tư]'}
                </span>
              </div>

              <div className="preview-field-item">
                <span className="preview-label">Ngày sinh:</span>
                <span className="preview-value">
                  {isVisibleInPreview(birthdateVisibility) ? sampleMemberData.birthDate : '🔒 [Đã ẩn do riêng tư]'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsTab;
