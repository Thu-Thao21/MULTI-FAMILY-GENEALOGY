import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicLayout } from '../../components/guest/PublicLayout';
import { ROUTES } from '../../config/routes';
import './BusinessRegisterWizard.css';

export const BusinessRegisterWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTier = searchParams.get('tier') || 'tier-pro';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [repName, setRepName] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repRole, setRepRole] = useState('Trưởng tộc');

  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [familyOrigin, setFamilyOrigin] = useState('');
  const [familyDesc, setFamilyDesc] = useState('');

  const [selectedTier, setSelectedTier] = useState(initialTier);

  // Result state
  const [trackingCode, setTrackingCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repName || !repEmail || !repPhone) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin người đại diện.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName || !familyOrigin) {
      setErrorMsg('Vui lòng điền tên dòng họ và quê gốc.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleNextStep3 = () => {
    setStep(4);
  };

  const handleSubmitRegistration = () => {
    // Generate tracking code format BIZ-YYYYMMDD-XXXX
    const code = `BIZ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    setTrackingCode(code);
    setIsSubmitted(true);
  };

  return (
    <PublicLayout>
      <div className="wiz-container">
        <div className="wiz-header">
          <span className="wiz-badge">QUY TRÌNH DÀNH CHO KHÁCH / ĐẠI DIỆN DÒNG HỌ</span>
          <h1 className="wiz-title">Đăng Ký Khởi Tạo Dòng Họ Business (FR-GU-05, GU-06)</h1>
          <p className="wiz-subtitle">
            Luồng đăng ký 4 bước để yêu cầu thiết lập tài khoản quản trị dòng họ mới.
          </p>

          {/* Stepper Progress Bar */}
          {!isSubmitted && (
            <div className="wiz-stepper-bar">
              <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span className="step-text">Đại diện dòng họ</span>
              </div>
              <div className="step-line" />
              <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-text">Thông tin dòng họ</span>
              </div>
              <div className="step-line" />
              <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span className="step-text">Chọn gói Business</span>
              </div>
              <div className="step-line" />
              <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
                <span className="step-num">4</span>
                <span className="step-text">Kiểm tra & Gửi</span>
              </div>
            </div>
          )}
        </div>

        {errorMsg && <div className="wiz-error-alert">{errorMsg}</div>}

        {isSubmitted ? (
          /* Receipt Card after successful submission */
          <div className="wiz-receipt-card">
            <div className="receipt-icon">🎉</div>
            <h2 className="receipt-title">Đăng Ký Khởi Tạo Business Thành Công!</h2>
            <p className="receipt-desc">
              Yêu cầu của bạn đã được ghi nhận vào hệ thống. Quản trị viên sẽ tiến hành thẩm định và phản hồi trong thời gian sớm nhất.
            </p>

            <div className="receipt-code-box">
              <span className="code-label">MÃ TRA CỨU THEO DÕI YÊU CẦU:</span>
              <strong className="code-value">{trackingCode}</strong>
            </div>

            <div className="receipt-warning">
              ⚠️ <strong>Lưu ý quan trọng:</strong> Gửi đăng ký Business hoặc chọn gói chưa đồng nghĩa với việc được cấp quyền Business Owner ngay lập tức. Quyền sẽ được kích hoạt sau khi yêu cầu được duyệt chính thức.
            </div>

            <div className="receipt-actions">
              <button
                className="pub-btn-primary"
                onClick={() => navigate(`${ROUTES.PUBLIC.BUSINESS_TRACK}?code=${trackingCode}`)}
              >
                Mở Màn Hình Theo Dõi Trạng Thái (FR-GU-07) ➔
              </button>
            </div>
          </div>
        ) : (
          <div className="wiz-form-card">
            {/* STEP 1: Representative Info */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="wiz-step-form">
                <h3 className="step-title">Bước 1: Thông tin đại diện dòng họ (FR-GU-05)</h3>

                <div className="form-field">
                  <label className="field-label">Họ và tên người đại diện *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="VD: Nguyễn Văn A"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Địa chỉ Email liên hệ *</label>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="VD: nguyenvana@gmail.com"
                    value={repEmail}
                    onChange={(e) => setRepEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Số điện thoại di động *</label>
                  <input
                    type="tel"
                    className="field-input"
                    placeholder="VD: 0912345678"
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Vai trò / Chức danh trong dòng họ</label>
                  <select
                    className="field-select"
                    value={repRole}
                    onChange={(e) => setRepRole(e.target.value)}
                  >
                    <option value="Trưởng tộc">Trưởng tộc / Trưởng chi</option>
                    <option value="Hội đồng gia tộc">Thành viên Hội đồng gia tộc</option>
                    <option value="Thành viên được ủy quyền">Thành viên được dòng họ ủy quyền</option>
                  </select>
                </div>

                <div className="wiz-action-row">
                  <button type="submit" className="wiz-next-btn">
                    Tiếp tục Bước 2 ➔
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Family Info */}
            {step === 2 && (
              <form onSubmit={handleNextStep2} className="wiz-step-form">
                <h3 className="step-title">Bước 2: Thông tin chi tiết dòng họ (FR-GU-05)</h3>

                <div className="form-field">
                  <label className="field-label">Tên dòng họ đăng ký *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="VD: Dòng Họ Nguyễn Chi 1 Kim Liên"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Quê gốc / Nhà thờ tổ chính *</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="VD: Làng Đông, Xã Kim Liên, Huyện Nam Đàn, Nghệ An"
                    value={familyOrigin}
                    onChange={(e) => setFamilyOrigin(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Gợi ý Mã dòng họ viết tắt (nếu có)</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="VD: NGUYEN_KL"
                    value={familyCode}
                    onChange={(e) => setFamilyCode(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Mô tả tóm tắt lịch sử dòng họ</label>
                  <textarea
                    className="field-textarea"
                    rows={3}
                    placeholder="Tóm tắt truyền thống, các chi nhánh chính..."
                    value={familyDesc}
                    onChange={(e) => setFamilyDesc(e.target.value)}
                  />
                </div>

                <div className="wiz-action-row">
                  <button type="button" className="wiz-back-btn" onClick={() => setStep(1)}>
                    ← Quay lại
                  </button>
                  <button type="submit" className="wiz-next-btn">
                    Tiếp tục Bước 3 ➔
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Select Package Tier */}
            {step === 3 && (
              <div className="wiz-step-form">
                <h3 className="step-title">Bước 3: Chọn gói dịch vụ Business (FR-GU-06)</h3>

                <div className="tier-select-grid">
                  <div
                    className={`tier-option-card ${selectedTier === 'tier-basic' ? 'selected' : ''}`}
                    onClick={() => setSelectedTier('tier-basic')}
                  >
                    <h4>Gói Tiêu Chuẩn</h4>
                    <span className="tier-limit">Tối đa 200 thành viên</span>
                    <p className="tier-desc">Cơ bản cho chi họ nhỏ.</p>
                  </div>

                  <div
                    className={`tier-option-card ${selectedTier === 'tier-pro' ? 'selected' : ''}`}
                    onClick={() => setSelectedTier('tier-pro')}
                  >
                    <span className="rec-pill">Đề xuất</span>
                    <h4>Gói Chuyên Nghiệp</h4>
                    <span className="tier-limit">Tối đa 1.000 thành viên</span>
                    <p className="tier-desc">Đầy đủ tính năng liên họ, AI & Quỹ.</p>
                  </div>

                  <div
                    className={`tier-option-card ${selectedTier === 'tier-enterprise' ? 'selected' : ''}`}
                    onClick={() => setSelectedTier('tier-enterprise')}
                  >
                    <h4>Gói Đại Tộc</h4>
                    <span className="tier-limit">Không giới hạn</span>
                    <p className="tier-desc">Dành cho dòng họ lớn nhiều chi nhánh.</p>
                  </div>
                </div>

                <div className="wiz-action-row">
                  <button type="button" className="wiz-back-btn" onClick={() => setStep(2)}>
                    ← Quay lại
                  </button>
                  <button type="button" className="wiz-next-btn" onClick={handleNextStep3}>
                    Tiếp tục Xem lại ➔
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Confirm */}
            {step === 4 && (
              <div className="wiz-step-form">
                <h3 className="step-title">Bước 4: Xác nhận thông tin đăng ký</h3>

                <div className="review-box">
                  <h4>1. Người Đại Diện:</h4>
                  <p>{repName} ({repRole}) — Email: {repEmail} — SĐT: {repPhone}</p>

                  <h4 style={{ marginTop: '12px' }}>2. Dòng Họ:</h4>
                  <p>{familyName} — Quê gốc: {familyOrigin}</p>

                  <h4 style={{ marginTop: '12px' }}>3. Gói Đã Chọn:</h4>
                  <p style={{ fontWeight: 700, color: '#2563eb' }}>
                    {selectedTier === 'tier-basic' && 'Gói Tiêu Chuẩn (200 thành viên)'}
                    {selectedTier === 'tier-pro' && 'Gói Chuyên Nghiệp (1.000 thành viên)'}
                    {selectedTier === 'tier-enterprise' && 'Gói Đại Tộc (Không giới hạn)'}
                  </p>
                </div>

                <div className="wiz-action-row">
                  <button type="button" className="wiz-back-btn" onClick={() => setStep(3)}>
                    ← Sửa lại
                  </button>
                  <button
                    type="button"
                    className="wiz-submit-btn"
                    onClick={handleSubmitRegistration}
                  >
                    ✓ Gửi Đăng Ký Khởi Tạo Business
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default BusinessRegisterWizard;
