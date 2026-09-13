import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '../../components/guest/PublicLayout';
import './BusinessTrackStatusPage.css';

export interface BusinessRequestStatus {
  code: string;
  repName: string;
  familyName: string;
  tierName: string;
  status: 'pending' | 'approved' | 'needs_info' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export const BusinessTrackStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(urlCode);
  const [currentResult, setCurrentResult] = useState<BusinessRequestStatus | null>(null);
  const [searched, setSearched] = useState(false);

  // Supplemental info form state for 'needs_info' status
  const [suppInfo, setSuppInfo] = useState('');
  const [suppSuccess, setSuppSuccess] = useState(false);

  useEffect(() => {
    if (urlCode) {
      handleLookup(urlCode);
    }
  }, [urlCode]);

  const handleLookup = (codeToSearch?: string) => {
    const code = codeToSearch || inputCode;
    if (!code.trim()) return;

    setSearched(true);
    // Simulate lookup API
    if (code.toUpperCase().includes('BIZ')) {
      setCurrentResult({
        code: code.toUpperCase(),
        repName: 'Nguyễn Văn A',
        familyName: 'Dòng Họ Nguyễn Chi 1',
        tierName: 'Gói Chuyên Nghiệp (1.000 thành viên)',
        status: 'pending',
        submittedAt: '2026-09-12 10:00',
        updatedAt: '2026-09-12 11:30',
        adminNotes: 'Hồ sơ đang trong quá trình đối soát thông tin nhà thờ tổ.',
      });
    } else {
      setCurrentResult(null);
    }
  };

  const handleSendSupplemental = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppInfo.trim()) return;
    setSuppSuccess(true);
    setSuppInfo('');
    setTimeout(() => setSuppSuccess(false), 4000);
  };

  return (
    <PublicLayout>
      <div className="track-container">
        <div className="track-header">
          <span className="track-badge">TRA CỨU TRẠNG THÁI YÊU CẦU</span>
          <h1 className="track-title">Theo Dõi Đăng Ký Dòng Họ Business (FR-GU-07)</h1>
          <p className="track-subtitle">
            Nhập mã theo dõi yêu cầu (VD: BIZ-20260912-1234) hoặc email đại diện để kiểm tra tiến độ xét duyệt.
          </p>

          <form
            className="track-search-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
          >
            <input
              type="text"
              className="track-input"
              placeholder="Nhập mã tra cứu BIZ-... hoặc Email đại diện"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              required
            />
            <button type="submit" className="track-btn">
              🔍 Tra Cứu Ngay
            </button>
          </form>
        </div>

        {searched && (
          <div className="track-result-section">
            {!currentResult ? (
              <div className="track-empty">
                ❌ Không tìm thấy yêu cầu đăng ký nào khớp với mã <strong>{inputCode}</strong>.
                Vui lòng kiểm tra lại chính xác mã tra cứu đã cấp.
              </div>
            ) : (
              <div className="status-detail-card">
                <div className="status-card-head">
                  <div>
                    <span className="code-tag">Mã yêu cầu: {currentResult.code}</span>
                    <h3 className="req-family-name">{currentResult.familyName}</h3>
                  </div>

                  <span className={`status-pill ${currentResult.status}`}>
                    {currentResult.status === 'pending' && '⏳ Đang chờ duyệt'}
                    {currentResult.status === 'approved' && '✓ Đã chấp thuận'}
                    {currentResult.status === 'needs_info' && '⚠️ Cần bổ sung thông tin'}
                    {currentResult.status === 'rejected' && '✕ Từ chối'}
                  </span>
                </div>

                <div className="req-meta-grid">
                  <div>👤 <strong>Người đại diện:</strong> {currentResult.repName}</div>
                  <div>📦 <strong>Gói đăng ký:</strong> {currentResult.tierName}</div>
                  <div>📅 <strong>Thời điểm gửi:</strong> {currentResult.submittedAt}</div>
                  <div>🕒 <strong>Cập nhật lần cuối:</strong> {currentResult.updatedAt}</div>
                </div>

                {currentResult.adminNotes && (
                  <div className="admin-response-box">
                    <strong>Phản hồi từ Ban Quản Trị:</strong> {currentResult.adminNotes}
                  </div>
                )}

                {/* Supplemental Form if Status is 'needs_info' */}
                {currentResult.status === 'needs_info' && (
                  <div className="supp-info-box">
                    <h4>Bổ sung thông tin theo yêu cầu của Admin:</h4>
                    {suppSuccess && (
                      <div className="supp-success">
                        ✓ Đã gửi thông tin bổ sung thành công!
                      </div>
                    )}
                    <form onSubmit={handleSendSupplemental} className="supp-form">
                      <textarea
                        className="supp-textarea"
                        rows={3}
                        placeholder="Nhập thông tin đính chính hoặc minh chứng bổ sung..."
                        value={suppInfo}
                        onChange={(e) => setSuppInfo(e.target.value)}
                        required
                      />
                      <button type="submit" className="supp-submit-btn">
                        Gửi thông tin bổ sung
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default BusinessTrackStatusPage;
